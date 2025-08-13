import prisma from '@/lib/prisma';
import { getI18n } from '@/locales/server';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the map component to disable SSR
const MapWithNoSSR = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
});

async function getBusinessesForMap() {
  const businesses = await prisma.business.findMany({
    select: { id: true, name: true, address: true },
  });

  // SIMULATED GEOCODING
  // In a real app, you would use a geocoding service to convert addresses to lat/lng.
  // Here, we'll assign placeholder coordinates around Blok M.
  const locations = businesses.map((business, index) => ({
    id: business.id,
    name: business.name,
    position: [
      -6.2443 + (Math.random() - 0.5) * 0.01, // Latitude around Blok M
      106.8009 + (Math.random() - 0.5) * 0.01, // Longitude around Blok M
    ] as [number, number],
  }));

  return locations;
}

export default async function MapPage() {
  const t = await getI18n();
  const locations = await getBusinessesForMap();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Interactive Map</h1>
      <div className="h-[600px] w-full border rounded-lg shadow-md">
        <MapWithNoSSR locations={locations} />
      </div>
    </div>
  );
}
