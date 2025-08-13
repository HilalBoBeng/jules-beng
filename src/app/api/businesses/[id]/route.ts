import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET a single business by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        reviews: { // Include full reviews
          include: {
            user: { // Also include user info for the review
              select: { name: true, id: true }
            }
          }
        },
        galleryItems: true,
      },
    });

    if (!business) {
      return new NextResponse('Business not found', { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('GET_BUSINESS_BY_ID_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT (update) a business by ID (protected by middleware)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    const business = await prisma.business.update({
      where: { id },
      data: body, // Pass the whole body for easy updates
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error('PUT_BUSINESS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a business by ID (protected by middleware)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    // Note: In a real app, you might need to handle cascading deletes
    // for reviews and gallery items if not handled by the DB schema.
    // Prisma's default behavior might need to be configured for this.
    await prisma.business.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE_BUSINESS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
