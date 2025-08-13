import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

// POST a new review for a business (protected by middleware)
export async function POST(request: Request) {
  try {
    const headersList = headers();
    const userId = headersList.get('X-User-Id');

    if (!userId) {
      // This should technically be caught by middleware, but as a safeguard:
      return new NextResponse('Unauthorized: User ID not found in token', { status: 401 });
    }

    const body = await request.json();
    const { businessId, rating, comment } = body;

    if (!businessId || !rating || !comment) {
      return new NextResponse('Business ID, rating, and comment are required', { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return new NextResponse('Rating must be between 1 and 5', { status: 400 });
    }

    // Check if the user has already reviewed this business
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (existingReview) {
      return new NextResponse('You have already reviewed this business', { status: 409 }); // 409 Conflict
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        businessId,
        userId,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST_REVIEW_ERROR', error);
    // Check for unique constraint violation error from Prisma
    if ((error as any)?.code === 'P2002') {
        return new NextResponse('You have already reviewed this business', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
