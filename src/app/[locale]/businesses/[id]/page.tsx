import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getLocale } from '@/locales/server';
import ReviewForm from '@/components/reviews/ReviewForm'; // I will create this next

interface BusinessDetailPageProps {
  params: {
    id: string;
  };
}

async function getBusiness(id: string) {
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      galleryItems: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!business) {
    notFound();
  }
  return business;
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const locale = await getLocale();
  const business = await getBusiness(params.id);

  const name = locale === 'en' && business.name ? business.name : business.name;
  const description = locale === 'en' && business.descriptionEn ? business.descriptionEn : business.description;

  return (
    <div>
      {/* Business Header */}
      <div className="border-b pb-8 mb-8">
        <h1 className="text-5xl font-bold">{name}</h1>
        <p className="text-lg text-gray-600 mt-2">{business.category}</p>
        <div className="mt-4 text-gray-700">
          <p>{business.address}</p>
          <p>{business.phone}</p>
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Visit Website
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-lg leading-relaxed">{description}</p>
      </div>

      {/* Gallery */}
      {business.galleryItems.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.galleryItems.map(item => (
              <div key={item.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img src={item.url} alt={item.caption || name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Reviews</h2>
        <div className="mb-8">
          <ReviewForm businessId={business.id} />
        </div>
        <div className="space-y-6">
          {business.reviews.length > 0 ? (
            business.reviews.map(review => (
              <div key={review.id} className="border-t pt-6">
                <div className="flex items-center mb-2">
                  <div className="font-bold mr-4">{review.user.name}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
