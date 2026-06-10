import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Resolve the database path to an absolute path, consistent between
// the Prisma CLI (runs from project root) and the Next.js server.
// DATABASE_URL in .env: "file:./dev.db" → resolves to <projectRoot>/dev.db
const getDatabasePath = (): string => {
  const envUrl = process.env.DATABASE_URL || "file:./dev.db";
  // Strip the "file:" prefix to get the relative/absolute path
  const relativePath = envUrl.startsWith("file:") ? envUrl.slice(5) : envUrl;
  // Always resolve relative to the project root (process.cwd())
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), relativePath);
};

const dbPath = getDatabasePath();

// Prevent multiple instances of PrismaClient in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
