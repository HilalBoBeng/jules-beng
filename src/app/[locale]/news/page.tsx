import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getI18n } from '@/locales/server';

async function getNews() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
  });
  return articles;
}

export default async function NewsPage() {
  const t = await getI18n();
  const articles = await getNews();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.news')}</h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/news/${article.id}`}>
              <h2 className="text-2xl font-semibold text-blue-700 hover:underline">
                {article.title}
              </h2>
            </Link>
            <p className="text-gray-500 text-sm mt-1">
              {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-700 mt-2">
              {article.content.substring(0, 200)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
