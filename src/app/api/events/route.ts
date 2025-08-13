import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET_EVENTS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new event (protected by middleware)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, location, titleEn, descriptionEn } = body;

    if (!title || !description || !startTime || !endTime) {
      return new NextResponse('Title, description, startTime, and endTime are required', { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        titleEn,
        descriptionEn,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('POST_EVENT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
