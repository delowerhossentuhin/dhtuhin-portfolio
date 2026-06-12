import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ResumeSettings } from '@/models/ResumeSettings';
import { requireAdmin } from '@/lib/requireAdmin';
import { profile } from '@/data/site';

export const runtime = 'nodejs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const CV_PATH = 'public/cv/Delower_Hossen_Tuhin_CV.pdf';

async function getFileSha(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CV_PATH}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'portfolio-app' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.sha ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ cvUrl: profile.resumePath, updatedLabel: 'April 2026' });
  try {
    await dbConnect();
    const settings = await ResumeSettings.findOne().lean() as any;
    if (settings?.updatedLabel) {
      return NextResponse.json({
        cvUrl: profile.resumePath,
        updatedLabel: settings.updatedLabel,
      });
    }
  } catch (e) {
    console.error('[resume] GET', e);
  }
  return NextResponse.json({ cvUrl: profile.resumePath, updatedLabel: 'April 2026' });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json({ message: 'GitHub not configured.' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const updatedLabel = (formData.get('updatedLabel') as string) ?? 'April 2026';

    if (!file) return NextResponse.json({ message: 'No file provided.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    // Get current file SHA (needed for update)
    const sha = await getFileSha();

    // Commit file to GitHub
    const body: any = {
      message: `cv: update CV — ${updatedLabel}`,
      content: base64,
      branch: 'main',
    };
    if (sha) body.sha = sha;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CV_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'portfolio-app',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? 'GitHub upload failed');
    }

    // Save updated label to DB
    if (hasDatabase) {
      await dbConnect();
      await ResumeSettings.findOneAndUpdate(
        {},
        { cvUrl: profile.resumePath, updatedLabel },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ cvUrl: profile.resumePath, updatedLabel });
  } catch (e: any) {
    console.error('[resume] POST', e);
    return NextResponse.json({ message: e.message ?? 'Upload failed.' }, { status: 500 });
  }
}