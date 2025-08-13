import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getLocale } from '@/locales/server';

interface NewsArticlePageProps {
  params: {
    id: string;
  };
}

async function getArticle(id: string) {
  const article = await prisma.newsArticle.findUnique({
    where: { id },
  });
  if (!article) {
    notFound();
  }
  return article;
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const locale = await getLocale();
  const article = await getArticle(params.id);

  const title = locale === 'en' && article.titleEn ? article.titleEn : article.title;
  const content = locale === 'en' && article.contentEn ? article.contentEn : article.content;

  return (
    <article className="prose lg:prose-xl max-w-none">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="text-gray-500 text-sm mb-8">
        <span>
          {new Date(article.publishedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        {article.author && <span> by {article.author}</span>}
      </div>
      <div
        className="text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    </article>
  );
}

// Optional: Improve SEO by generating static pages for each article at build time
export async function generateStaticParams() {
  const articles = await prisma.newsArticle.findMany({ select: { id: true } });
  return articles.map((article) => ({
    id: article.id,
  }));
}
