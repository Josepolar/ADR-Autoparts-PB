import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // Hash the admin password properly
  const hash = await bcrypt.hash("admin123", 12);
  
  // Update admin: fix email to match what user types + hash password
  const admin = await db.user.update({
    where: { email: "admin@adr-autoparts.com" },
    data: {
      email: "admin@adrautoparts.com",
      passwordHash: hash,
    },
  });
  console.log("Updated admin:", admin.email, "| role:", admin.role);
  
  // Also hash the other demo passwords
  const mechHash = await bcrypt.hash("mechanic123", 12);
  await db.user.update({
    where: { email: "mechanic@adr-autoparts.com" },
    data: { passwordHash: mechHash },
  });
  
  const custHash = await bcrypt.hash("customer123", 12);
  await db.user.updateMany({
    where: { email: { in: ["customer1@example.com", "customer2@example.com"] } },
    data: { passwordHash: custHash },
  });
  
  console.log("All passwords hashed with bcrypt.");
}

main().catch(console.error).finally(() => db["$disconnect"]());
