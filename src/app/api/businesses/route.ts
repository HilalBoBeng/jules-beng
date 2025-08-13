import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all businesses
export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        reviews: true, // Optionally include reviews count or average rating later
      },
    });
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('GET_BUSINESSES_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new business (protected by middleware)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, descriptionEn, address, phone, website, category } = body;

    if (!name || !description || !category) {
      return new NextResponse('Name, description, and category are required', { status: 400 });
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        descriptionEn,
        address,
        phone,
        website,
        category,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('POST_BUSINESS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
