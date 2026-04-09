const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Checking Membership Plans:');
    const plans = await prisma.membershipPlan.findMany();
    console.log('Plans:', plans.length, plans);

    console.log('\nChecking Memberships:');
    const memberships = await prisma.membership.findMany();
    console.log('Memberships:', memberships.length, memberships.map(m => ({
      id: m.id,
      memberId: m.memberId,
      name: m.name,
      type: m.type
    })));

    console.log('\nChecking Transactions:');
    const transactions = await prisma.transaction.findMany({ take: 3 });
    console.log('Transactions:', transactions.length, transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description?.substring(0, 50)
    })));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();