import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ message: 'No file provided.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'portfolio/gallery',
      resource_type: 'image',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ message: 'Upload failed.' }, { status: 500 });
  }
}