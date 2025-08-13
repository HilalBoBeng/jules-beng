import { getI18n } from '@/locales/server';

export default async function Home() {
  const t = await getI18n();

  return (
    <div className="text-center">
      <div className="py-24 sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
          {t('homepage.title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 text-balance">
          Your official guide to the vibrant Blok M district. Discover the best shops, restaurants, and events in the heart of South Jakarta.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/events"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t('nav.events')}
          </a>
          <a href="/businesses" className="text-sm font-semibold leading-6 text-gray-900">
            {t('nav.directory')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
