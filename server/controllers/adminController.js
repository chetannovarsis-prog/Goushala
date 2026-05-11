const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cow Price
exports.getCowPrice = async (req, res) => {
  try {
    const price = await prisma.cowPricing.findFirst();
    res.json(price || { price: 5000 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCowPrice = async (req, res) => {
  const { price } = req.body;
  try {
    let cowPrice = await prisma.cowPricing.findFirst();
    if (cowPrice) {
      cowPrice = await prisma.cowPricing.update({
        where: { id: cowPrice.id },
        data: { price: parseFloat(price) }
      });
    } else {
      cowPrice = await prisma.cowPricing.create({
        data: { price: parseFloat(price) }
      });
    }
    res.json(cowPrice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bhandara Categories
exports.getBhandaraCategories = async (req, res) => {
  try {
    const categories = await prisma.bhandaraCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBhandaraCategory = async (req, res) => {
  const { title, peopleCount, price } = req.body;
  try {
    const category = await prisma.bhandaraCategory.create({
      data: { title, peopleCount: parseInt(peopleCount), price: parseFloat(price) }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBhandaraCategory = async (req, res) => {
  const { id } = req.params;
  const { title, peopleCount, price } = req.body;
  try {
    const category = await prisma.bhandaraCategory.update({
      where: { id: parseInt(id) },
      data: { title, peopleCount: parseInt(peopleCount), price: parseFloat(price) }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBhandaraCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.bhandaraCategory.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stats
exports.getStats = async (req, res) => {
  try {
    const totalDonations = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: 'success' }
    });
    const totalCows = await prisma.donation.aggregate({
      _sum: { quantity: true },
      where: { status: 'success', type: 'cow' }
    });
    const recentTransactions = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      totalDonations: totalDonations._sum.amount || 0,
      totalCowsSponsored: totalCows._sum.quantity || 0,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Karyakarta Management
exports.getKaryakartas = async (req, res) => {
  try {
    const karyakartas = await prisma.karyakarta.findMany();
    res.json(karyakartas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addKaryakarta = async (req, res) => {
  const { name, role, phone, joiningDate } = req.body;
  try {
    const karyakarta = await prisma.karyakarta.create({
      data: { name, role, phone, joiningDate: joiningDate ? new Date(joiningDate) : new Date() }
    });
    res.status(201).json(karyakarta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteKaryakarta = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.karyakarta.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Karyakarta deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Management
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStudent = async (req, res) => {
  const { name, details } = req.body;
  try {
    const student = await prisma.student.create({
      data: { name, details }
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transactions / Accounting
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTransaction = async (req, res) => {
  const { 
    type, 
    amount, 
    transaction_type, 
    category, 
    payment_mode, 
    reference_id, 
    user_id, 
    description, 
    attachment_url, 
    recurring, 
    date 
  } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: { 
        type, 
        amount: parseFloat(amount), 
        transaction_type,
        category,
        payment_mode,
        reference_id,
        user_id: user_id ? parseInt(user_id) : null,
        description, 
        attachment_url,
        recurring: recurring || 'none',
        date: date ? new Date(date) : new Date() 
      }
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const {
    type,
    amount,
    transaction_type,
    category,
    payment_mode,
    reference_id,
    user_id,
    description,
    attachment_url,
    recurring,
    date
  } = req.body;

  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        ...(type ? { type } : {}),
        ...(amount !== undefined ? { amount: parseFloat(amount) } : {}),
        ...(transaction_type ? { transaction_type } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(payment_mode !== undefined ? { payment_mode } : {}),
        ...(reference_id !== undefined ? { reference_id } : {}),
        ...(user_id !== undefined ? { user_id: user_id ? parseInt(user_id) : null } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(attachment_url !== undefined ? { attachment_url } : {}),
        ...(recurring !== undefined ? { recurring } : {}),
        ...(date !== undefined ? { date: date ? new Date(date) : new Date() } : {}),
      }
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memberships
exports.getMemberships = async (req, res) => {
  try {
    const memberships = await prisma.membership.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMembershipById = async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await prisma.membership.findUnique({
      where: { id: parseInt(id) }
    });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMembership = async (req, res) => {
  const { userId, type, planAmount, startDate, endDate } = req.body;
  try {
    const membership = await prisma.membership.create({
      data: {
        userId: parseInt(userId),
        type,
        planAmount: parseFloat(planAmount),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: 'active'
      }
    });
    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMembership = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    name,
    email,
    phone,
    whatsapp,
    type,
    planAmount,
    status,
    payment_status,
    razorpay_order_id,
    razorpay_payment_id,
    qr_id,
    require80G,
    address,
    pan,
    referral,
    profession,
    startDate,
    endDate,
    certificateUrl,
  } = req.body;

  try {
    const membership = await prisma.membership.update({
      where: { id: parseInt(id) },
      data: {
        ...(userId !== undefined ? { userId: parseInt(userId) } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsapp !== undefined ? { whatsapp } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(planAmount !== undefined ? { planAmount: parseFloat(planAmount) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(payment_status !== undefined ? { payment_status } : {}),
        ...(razorpay_order_id !== undefined ? { razorpay_order_id } : {}),
        ...(razorpay_payment_id !== undefined ? { razorpay_payment_id } : {}),
        ...(qr_id !== undefined ? { qr_id } : {}),
        ...(require80G !== undefined ? { require80G: !!require80G } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(pan !== undefined ? { pan } : {}),
        ...(referral !== undefined ? { referral } : {}),
        ...(profession !== undefined ? { profession } : {}),
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : new Date() } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
        ...(certificateUrl !== undefined ? { certificateUrl } : {}),
      }
    });
    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMembership = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.membership.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Membership deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donations (Admin)
exports.getDonations = async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonation = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    whatsapp,
    email,
    type,
    quantity,
    amount,
    status,
    razorpay_order_id,
    razorpay_payment_id,
    qr_id,
    require80G,
    address,
    pan,
    referral,
    profession,
  } = req.body;

  try {
    const donation = await prisma.donation.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(whatsapp !== undefined ? { whatsapp } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(quantity !== undefined ? { quantity: parseInt(quantity) || 1 } : {}),
        ...(amount !== undefined ? { amount: parseFloat(amount) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(razorpay_order_id !== undefined ? { razorpay_order_id } : {}),
        ...(razorpay_payment_id !== undefined ? { razorpay_payment_id } : {}),
        ...(qr_id !== undefined ? { qr_id } : {}),
        ...(require80G !== undefined ? { require80G: !!require80G } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(pan !== undefined ? { pan } : {}),
        ...(referral !== undefined ? { referral } : {}),
        ...(profession !== undefined ? { profession } : {}),
      }
    });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.donation.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: parseInt(id) }
    });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
