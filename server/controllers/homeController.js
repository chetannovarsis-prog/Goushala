const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRecentActivity = async (req, res) => {
  try {
    const [donations, memberships] = await Promise.all([
      prisma.donation.findMany({
        where: { status: 'success' },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.membership.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Format and combine
    const formattedDonations = donations.map(d => ({
      id: `d-${d.id}`,
      name: d.name,
      type: 'donation',
      donationType: d.type, // cow / bhandara
      quantity: d.quantity,
      amount: d.amount,
      date: d.createdAt,
      profession: d.profession
    }));

    const formattedMemberships = memberships.map(m => ({
      id: `m-${m.id}`,
      name: m.name,
      type: 'membership',
      planName: m.type, // yearly / lifetime (can be enhanced if planName is in model)
      amount: m.planAmount,
      date: m.createdAt,
      profession: m.profession
    }));

    const activity = [...formattedDonations, ...formattedMemberships]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
