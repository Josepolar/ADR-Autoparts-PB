import { PrismaClient } from "@prisma/client";

async function main() {
  console.log("Testing PrismaClient instantiation...");
  
  try {
    const prisma = new PrismaClient();
    console.log("✅ PrismaClient created");
    
    // Test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection works:", result);
    
    // List available models
    console.log("✅ Available models:", Object.keys(prisma).filter((k) => !k.startsWith("$")));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
