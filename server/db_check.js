const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log("Checking User table...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    console.log("Checking MembershipPlan table...");
    const planCount = await prisma.membershipPlan.count();
    console.log("MembershipPlan count:", planCount);
  } catch (err) {
    console.error("Error during check:", err.message);
    if (err.code) console.error("Error code:", err.code);
  } finally {
    await prisma.$disconnect();
  }
}

check();
