import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prevent multiple instances of PrismaClient in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not defined. Please add a valid PostgreSQL connection string (e.g., postgresql://...) to your .env file."
    );
  }

  if (connectionString.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL is configured for SQLite ('file:...'), but the project has been migrated to PostgreSQL for production. Please update DATABASE_URL in your .env file to a valid PostgreSQL connection string."
    );
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
