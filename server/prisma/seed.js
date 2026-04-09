const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@gaushala.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gaushala.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  // Default Cow Price
  await prisma.cowPricing.create({ data: { price: 5000 } });

  // Default Bhandara Categories
  await prisma.bhandaraCategory.createMany({
    data: [
      { title: 'Small Bhandara', peopleCount: 50, price: 2500 },
      { title: 'Medium Bhandara', peopleCount: 150, price: 7500 },
      { title: 'Large Bhandara', peopleCount: 500, price: 25000 },
    ]
  });

  // Default Membership Plans
  await prisma.membershipPlan.createMany({
    data: [
      { name: 'Standard', type: 'yearly', price: 501, benefits: ['Membership certificate (PDF)', 'Name listed on website', 'Monthly updates (email/WhatsApp)', 'Festival invites'] },
      { name: 'Silver', type: 'yearly', price: 1100, benefits: ['All Standard benefits', 'Special mention in newsletter', 'Quarterly Gau-Sewa report'] },
      { name: 'Gold', type: 'yearly', price: 2100, benefits: ['All Silver benefits', 'Priority festival invites', 'Gau-Daan certificate'] },
      { name: 'Patron', type: 'lifetime', price: 11000, benefits: ['Lifetime certificate', 'Special recognition (VIP donor)', 'Name on donor wall', 'Priority invites'] },
      { name: 'Guardian', type: 'lifetime', price: 21000, benefits: ['All Patron benefits', 'Dedicated plaque at Gaushala', 'Personalized annual puja'] },
      { name: 'Legacy', type: 'lifetime', price: 51000, benefits: ['All Guardian benefits', 'VIP guest at all major events', 'Family name on entrance arch'] },
    ]
  });

  console.log('Seeding complete! Admin: admin@gaushala.com / admin123');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
