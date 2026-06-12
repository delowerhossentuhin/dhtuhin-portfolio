import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ResumeSettings } from '@/models/ResumeSettings';
import { requireAdmin } from '@/lib/requireAdmin';
import { v2 as cloudinary } from 'cloudinary';
import { profile } from '@/data/site';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ cvUrl: profile.resumePath, updatedLabel: 'April 2026' });
  try {
    await dbConnect();
    const settings = await ResumeSettings.findOne().lean() as any;
    if (settings?.cvUrl) {
      return NextResponse.json({ cvUrl: settings.cvUrl, updatedLabel: settings.updatedLabel ?? 'April 2026' });
    }
  } catch (e) {
    console.error('[resume] GET', e);
  }
  return NextResponse.json({ cvUrl: profile.resumePath, updatedLabel: 'April 2026' });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const updatedLabel = formData.get('updatedLabel') as string ?? 'April 2026';

    if (!file) return NextResponse.json({ message: 'No file provided.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:application/pdf;base64,${buffer.toString('base64')}`;

    // Upload with .pdf format so Cloudinary serves it correctly
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'portfolio/cv',
      public_id: 'Delower_Hossen_Tuhin_CV',
      resource_type: 'raw',
      format: 'pdf',
      overwrite: true,
    });

    await dbConnect();
    await ResumeSettings.findOneAndUpdate(
      {},
      { cvUrl: result.secure_url, updatedLabel },
      { upsert: true, new: true },
    );

    return NextResponse.json({ cvUrl: result.secure_url, updatedLabel });
  } catch (e: any) {
    console.error('[resume] POST', e);
    return NextResponse.json({ message: e.message ?? 'Upload failed.' }, { status: 500 });
  }
}