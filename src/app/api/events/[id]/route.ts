import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET a single event by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('GET_EVENT_BY_ID_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT (update) an event by ID (protected by middleware)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Make sure to handle date conversions if they come in as strings
    if (body.startTime) body.startTime = new Date(body.startTime);
    if (body.endTime) body.endTime = new Date(body.endTime);

    const event = await prisma.event.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('PUT_EVENT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE an event by ID (protected by middleware)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.event.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE_EVENT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
