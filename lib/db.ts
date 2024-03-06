import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Next js use hot reload, new PrismaClient will genearte multiple times. So we check if there is prisma
// in globalThis variable.

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
