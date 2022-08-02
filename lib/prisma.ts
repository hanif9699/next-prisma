import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;
if (typeof window === "undefined") {
  if (!global.prisma) {
    prisma = new PrismaClient();
  } else {
    prisma = global.prisma;
  }
}

export default prisma;
