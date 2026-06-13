'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useRef } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Image as ImageIcon, Quote, Code, Minus, Highlighter,
  Undo, Redo,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({ content, onChange, onImageUpload }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  // Keep onChange in a ref so editor doesn't re-render when it changes
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleUpdate = useCallback(({ editor }: any) => {
    onChangeRef.current(editor.getHTML());
  }, []); // stable — never recreated

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
    content,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: 'prose-cinema min-h-[400px] p-4 focus:outline-none',
      },
    },
  }, []); // empty deps — editor never recreated on re-render

  if (!editor) return null;

  function setLink() {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    editor!.chain().focus().setLink({ href: url }).run();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (onImageUpload) {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  const btn = (active: boolean, title: string, onClick: () => void, children: React.ReactNode) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // prevent focus loss from editor
        onClick();
      }}
      className={`grid h-8 w-8 place-items-center rounded-lg transition text-sm ${
        active ? 'bg-sky-400/20 text-sky-300' : 'text-ink-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  const divider = () => <div className="mx-1 h-5 w-px bg-white/10" />;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-ink-900/50 p-2">
        {btn(false, 'Undo', () => editor.chain().focus().undo().run(), <Undo size={14} />)}
        {btn(false, 'Redo', () => editor.chain().focus().redo().run(), <Redo size={14} />)}
        {divider()}
        {btn(editor.isActive('heading', { level: 1 }), 'Heading 1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={14} />)}
        {btn(editor.isActive('heading', { level: 2 }), 'Heading 2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={14} />)}
        {btn(editor.isActive('heading', { level: 3 }), 'Heading 3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={14} />)}
        {divider()}
        {btn(editor.isActive('bold'), 'Bold', () => editor.chain().focus().toggleBold().run(), <Bold size={14} />)}
        {btn(editor.isActive('italic'), 'Italic', () => editor.chain().focus().toggleItalic().run(), <Italic size={14} />)}
        {btn(editor.isActive('underline'), 'Underline', () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={14} />)}
        {btn(editor.isActive('strike'), 'Strikethrough', () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={14} />)}
        {btn(editor.isActive('highlight'), 'Highlight', () => editor.chain().focus().toggleHighlight().run(), <Highlighter size={14} />)}
        {divider()}
        {btn(editor.isActive({ textAlign: 'left' }), 'Align left', () => editor.chain().focus().setTextAlign('left').run(), <AlignLeft size={14} />)}
        {btn(editor.isActive({ textAlign: 'center' }), 'Align center', () => editor.chain().focus().setTextAlign('center').run(), <AlignCenter size={14} />)}
        {btn(editor.isActive({ textAlign: 'right' }), 'Align right', () => editor.chain().focus().setTextAlign('right').run(), <AlignRight size={14} />)}
        {divider()}
        {btn(editor.isActive('bulletList'), 'Bullet list', () => editor.chain().focus().toggleBulletList().run(), <List size={14} />)}
        {btn(editor.isActive('orderedList'), 'Ordered list', () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={14} />)}
        {btn(editor.isActive('blockquote'), 'Blockquote', () => editor.chain().focus().toggleBlockquote().run(), <Quote size={14} />)}
        {btn(editor.isActive('code'), 'Code', () => editor.chain().focus().toggleCode().run(), <Code size={14} />)}
        {btn(false, 'Horizontal rule', () => editor.chain().focus().setHorizontalRule().run(), <Minus size={14} />)}
        {divider()}
        {btn(editor.isActive('link'), 'Add link', setLink, <LinkIcon size={14} />)}
        {btn(false, 'Insert image', () => fileRef.current?.click(), <ImageIcon size={14} />)}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}