import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET a single news article by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return new NextResponse('Article not found', { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('GET_NEWS_BY_ID_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT (update) a news article by ID (protected by middleware)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, titleEn, contentEn, author } = body;

    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title,
        content,
        titleEn,
        contentEn,
        author,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT_NEWS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a news article by ID (protected by middleware)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.newsArticle.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE_NEWS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
