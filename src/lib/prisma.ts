import { PrismaClient } from '@prisma/client';

// In development, Next.js clears the Node.js cache on every reload,
// which would create a new PrismaClient instance each time.
// This is a workaround to prevent that by storing it in a global object.
declare global {
  var prisma: PrismaClient | undefined;
}

const client = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = client;

export default client;
