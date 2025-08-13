'use client';

import Link from 'next/link';
import { useI18n, useChangeLocale, useCurrentLocale } from '@/locales/client';

const Header = () => {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Blok M</Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/news" className="text-gray-600 hover:text-blue-600">{t('nav.news')}</Link>
          <Link href="/events" className="text-gray-600 hover:text-blue-600">{t('nav.events')}</Link>
          <Link href="/businesses" className="text-gray-600 hover:text-blue-600">{t('nav.directory')}</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-blue-600">{t('nav.gallery')}</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600">{t('auth.login')}</button>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => changeLocale('id')}
              className={`px-2 py-1 text-sm rounded ${currentLocale === 'id' ? 'font-bold text-blue-600' : 'text-gray-500'}`}
            >
              ID
            </button>
            <span>/</span>
            <button
              onClick={() => changeLocale('en')}
              className={`px-2 py-1 text-sm rounded ${currentLocale === 'en' ? 'font-bold text-blue-600' : 'text-gray-500'}`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
