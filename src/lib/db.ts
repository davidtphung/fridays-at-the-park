// Prisma client singleton
// Uncomment when DATABASE_URL is configured

// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const db = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = db;
// }

// Placeholder export for when DB is not configured
export const db = null;
