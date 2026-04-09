const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const plans = [
    { name: 'Standard', type: 'yearly', price: 501, benefits: ['Membership certificate (PDF)', 'Name listed on website', 'Monthly updates (email/WhatsApp)', 'Festival invites'] },
    { name: 'Silver', type: 'yearly', price: 1100, benefits: ['All Standard benefits', 'Special mention in newsletter', 'Quarterly Gau-Sewa report'] },
    { name: 'Gold', type: 'yearly', price: 2100, benefits: ['All Silver benefits', 'Priority festival invites', 'Gau-Daan certificate'] },
    { name: 'Patron', type: 'lifetime', price: 11000, benefits: ['Lifetime certificate', 'Special recognition (VIP donor)', 'Name on donor wall', 'Priority invites'] },
    { name: 'Guardian', type: 'lifetime', price: 21000, benefits: ['All Patron benefits', 'Dedicated plaque at Gaushala', 'Personalized annual puja'] },
    { name: 'Legacy', type: 'lifetime', price: 51000, benefits: ['All Guardian benefits', 'VIP guest at all major events', 'Family name on entrance arch'] },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.create({ data: plan });
  }
  console.log('Seeded 6 membership plans');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
