import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all news articles
export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET_NEWS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new news article (protected by middleware)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, titleEn, contentEn, author } = body;

    if (!title || !content) {
      return new NextResponse('Title and content are required', { status: 400 });
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        titleEn,
        contentEn,
        author,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('POST_NEWS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
