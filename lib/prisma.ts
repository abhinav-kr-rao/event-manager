import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  prismaNonPooled: PrismaClient;
};

// Pooled connection (for regular queries)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

// Non-pooled connection (for transactions)
const adapterNonPooled = new PrismaPg({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
});

const prismaNonPooled =
  globalForPrisma.prismaNonPooled ||
  new PrismaClient({
    adapter: adapterNonPooled,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaNonPooled = prismaNonPooled;
}

export default prisma;
export { prismaNonPooled };