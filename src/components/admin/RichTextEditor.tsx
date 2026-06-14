'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef, useEffect } from 'react';
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
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExt.configure({ openOnClick: false }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
    content,
    onUpdate({ editor }) {
      onChangeRef.current(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'min-h-[400px] p-4 focus:outline-none text-white' },
    },
  });

  if (!editor) return null;

  // Use onMouseDown + preventDefault to avoid stealing focus from editor
  const T = (active: boolean, title: string, fn: () => void, icon: React.ReactNode) => (
    <button
      key={title}
      type="button"
      title={title}
      tabIndex={-1}
      onMouseDown={(e) => { e.preventDefault(); fn(); }}
      className={`grid h-8 w-8 place-items-center rounded transition ${
        active ? 'bg-sky-400/20 text-sky-300' : 'text-ink-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );

  const D = () => <div className="mx-0.5 h-5 w-px bg-white/10 flex-none" />;

  async function insertImage() {
    fileRef.current?.click();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    let src = '';
    if (onImageUpload) {
      src = await onImageUpload(file);
    } else {
      src = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(file);
      });
    }
    editor.chain().focus().setImage({ src }).run();
    e.target.value = '';
  }

  function addLink() {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Toolbar — tabIndex=-1 on all buttons prevents focus steal */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-ink-900/60 p-2">
        {T(false, 'Undo', () => editor.chain().focus().undo().run(), <Undo size={13} />)}
        {T(false, 'Redo', () => editor.chain().focus().redo().run(), <Redo size={13} />)}
        <D />
        {T(editor.isActive('heading',{level:1}), 'H1', () => editor.chain().focus().toggleHeading({level:1}).run(), <Heading1 size={13} />)}
        {T(editor.isActive('heading',{level:2}), 'H2', () => editor.chain().focus().toggleHeading({level:2}).run(), <Heading2 size={13} />)}
        {T(editor.isActive('heading',{level:3}), 'H3', () => editor.chain().focus().toggleHeading({level:3}).run(), <Heading3 size={13} />)}
        <D />
        {T(editor.isActive('bold'), 'Bold', () => editor.chain().focus().toggleBold().run(), <Bold size={13} />)}
        {T(editor.isActive('italic'), 'Italic', () => editor.chain().focus().toggleItalic().run(), <Italic size={13} />)}
        {T(editor.isActive('underline'), 'Underline', () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={13} />)}
        {T(editor.isActive('strike'), 'Strike', () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={13} />)}
        {T(editor.isActive('highlight'), 'Highlight', () => editor.chain().focus().toggleHighlight().run(), <Highlighter size={13} />)}
        <D />
        {T(editor.isActive({textAlign:'left'}), 'Left', () => editor.chain().focus().setTextAlign('left').run(), <AlignLeft size={13} />)}
        {T(editor.isActive({textAlign:'center'}), 'Center', () => editor.chain().focus().setTextAlign('center').run(), <AlignCenter size={13} />)}
        {T(editor.isActive({textAlign:'right'}), 'Right', () => editor.chain().focus().setTextAlign('right').run(), <AlignRight size={13} />)}
        <D />
        {T(editor.isActive('bulletList'), 'Bullet list', () => editor.chain().focus().toggleBulletList().run(), <List size={13} />)}
        {T(editor.isActive('orderedList'), 'Numbered list', () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={13} />)}
        {T(editor.isActive('blockquote'), 'Quote', () => editor.chain().focus().toggleBlockquote().run(), <Quote size={13} />)}
        {T(editor.isActive('code'), 'Code', () => editor.chain().focus().toggleCode().run(), <Code size={13} />)}
        {T(false, 'Divider', () => editor.chain().focus().setHorizontalRule().run(), <Minus size={13} />)}
        <D />
        {T(editor.isActive('link'), 'Link', addLink, <LinkIcon size={13} />)}
        {T(false, 'Image', insertImage, <ImageIcon size={13} />)}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror { min-height: 400px; padding: 1rem; outline: none; color: white; }
        .ProseMirror p.is-editor-empty:first-child::before { color: rgba(255,255,255,0.3); content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; color: white; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 0.875rem 0 0.5rem; color: white; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; color: white; }
        .ProseMirror p { margin: 0.4rem 0; color: rgba(255,255,255,0.85); line-height: 1.7; }
        .ProseMirror strong { color: white; font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u { text-decoration: underline; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror mark { background: rgba(250,204,21,0.35); color: white; padding: 0.1rem 0.2rem; border-radius: 2px; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; color: rgba(255,255,255,0.85); }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; color: rgba(255,255,255,0.85); }
        .ProseMirror li { margin: 0.25rem 0; }
        .ProseMirror blockquote { border-left: 3px solid rgba(125,211,252,0.5); padding-left: 1rem; color: rgba(255,255,255,0.6); font-style: italic; margin: 1rem 0; }
        .ProseMirror code { background: rgba(255,255,255,0.1); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.85em; font-family: monospace; }
        .ProseMirror pre { background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
        .ProseMirror pre code { background: none; padding: 0; }
        .ProseMirror img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; display: block; }
        .ProseMirror a { color: #7dd3fc; text-decoration: underline; }
        .ProseMirror hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}