import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all gallery items
export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET_GALLERY_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new gallery item (protected by middleware)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, captionEn, businessId } = body;

    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        url,
        caption,
        captionEn,
        businessId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST_GALLERY_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
