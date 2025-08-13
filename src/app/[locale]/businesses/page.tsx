import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getI18n } from '@/locales/server';

async function getBusinesses() {
  const businesses = await prisma.business.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return businesses;
}

export default async function BusinessesPage() {
  const t = await getI18n();
  const businesses = await getBusinesses();
  const locale = t.locale;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.directory')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {businesses.map((business) => {
          const name = locale === 'en' && business.name ? business.name : business.name; // Assuming name doesn't need translation for now
          const description = locale === 'en' && business.descriptionEn ? business.descriptionEn : business.description;

          return (
            <div key={business.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Placeholder for an image */}
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-800">
                  {name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{business.category}</p>
                <p className="text-gray-700 mt-4 h-24 overflow-hidden">
                  {description}
                </p>
                <div className="mt-4">
                  <Link href={`/businesses/${business.id}`} className="font-semibold text-blue-600 hover:underline">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
