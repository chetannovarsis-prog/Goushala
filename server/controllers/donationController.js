const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount, name, phone, whatsapp, email, type, quantity, require80G, address, pan, referral, profession } = req.body;

  try {
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create a pending donation record
    const donation = await prisma.donation.create({
      data: {
        name,
        phone,
        whatsapp,
        email,
        type,
        quantity: parseInt(quantity) || 1,
        amount: parseFloat(amount),
        status: 'pending',
        razorpay_order_id: order.id,
        require80G: !!require80G,
        address,
        pan,
        referral,
        profession,
      }
    });

    res.json({ order, donationId: donation.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

  try {
    const donation = await prisma.donation.update({
      where: { id: parseInt(donationId) },
      data: {
        status: 'success',
        razorpay_payment_id,
      }
    });

    // Create a corresponding transaction in the accounting ledger
    await prisma.transaction.create({
      data: {
        type: 'pay-in',
        amount: donation.amount,
        transaction_type: 'donation',
        category: donation.type, // cow or bhandara
        payment_mode: 'Razorpay',
        reference_id: razorpay_payment_id,
        description: `Online donation from ${donation.name} (${donation.type}${donation.require80G ? ', 80G Requested' : ''})`,
        date: new Date()
      }
    });

    res.json({ message: 'Payment verified successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
