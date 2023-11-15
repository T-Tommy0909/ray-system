import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

const createSeedAdmin = async () => {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    "password",
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedPassword) => {
      const range = [...Array(50)].map((_, i) => i + 1);
      const users = range.map((i) => ({
        email: `seedadmin${i}@example.com`,
        password: hashedPassword,
        salt: salt,
      }));

      await prisma.user.createMany({ data: users, skipDuplicates: true });
    }
  );
};

createSeedAdmin()
  .then(async () => {
    console.log("Success Seeding!!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
