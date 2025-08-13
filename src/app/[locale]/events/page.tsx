import prisma from '@/lib/prisma';
import { getI18n } from '@/locales/server';

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: {
      startTime: 'asc',
    },
    // Optional: Filter out past events
    // where: {
    //   startTime: {
    //     gte: new Date(),
    //   },
    // },
  });
  return events;
}

export default async function EventsPage() {
  const t = await getI18n();
  const events = await getEvents();
  const locale = t.locale;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.events')}</h1>
      <div className="space-y-8">
        {events.map((event) => {
          const title = locale === 'en' && event.titleEn ? event.titleEn : event.title;
          const description = locale === 'en' && event.descriptionEn ? event.descriptionEn : event.description;

          return (
            <div key={event.id} className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg shadow-sm">
              <div className="flex-shrink-0 md:w-48 text-center md:text-left">
                <div className="text-lg font-semibold text-blue-700">
                  {new Date(event.startTime).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleDateString(locale, { weekday: 'long' })}
                </div>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-500 mb-2">
                  {formatDate(event.startTime)} - {formatDate(event.endTime)}
                </p>
                <p className="text-gray-500 mb-4">
                  {event.location}
                </p>
                <p className="text-gray-700">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <p>There are no upcoming events at this time.</p>
        )}
      </div>
    </div>
  );
}
