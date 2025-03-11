import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    transactionOptions: {
      maxWait: 10000, // 10 seconds
      timeout: 10000, // 10 seconds
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;