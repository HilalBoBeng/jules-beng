import prisma from '@/lib/prisma';
import { getI18n } from '@/locales/server';

async function getGalleryItems() {
  const items = await prisma.galleryItem.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return items;
}

export default async function GalleryPage() {
  const t = await getI18n();
  const items = await getGalleryItems();
  const locale = t.locale;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.gallery')}</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const caption = locale === 'en' && item.captionEn ? item.captionEn : item.caption;
            return (
              <div key={item.id} className="group relative aspect-square">
                <img
                  src={item.url}
                  alt={caption || 'Gallery image'}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                {caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                    {caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>There are no items in the gallery yet.</p>
      )}
    </div>
  );
}
