import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET a single gallery item by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const item = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return new NextResponse('Gallery item not found', { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('GET_GALLERY_ITEM_BY_ID_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT (update) a gallery item by ID (protected by middleware)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    const item = await prisma.galleryItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('PUT_GALLERY_ITEM_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a gallery item by ID (protected by middleware)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.galleryItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE_GALLERY_ITEM_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
