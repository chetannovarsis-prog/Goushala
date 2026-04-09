const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to generate unique 6-digit membership ID
const generateUniqueMemberId = async () => {
  let memberId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate random 6-digit number
    memberId = String(Math.floor(100000 + Math.random() * 900000));
    
    // Check if it already exists
    const existing = await prisma.membership.findUnique({
      where: { memberId }
    });
    
    if (!existing) {
      isUnique = true;
    }
  }
  
  return memberId;
};

exports.createMembershipOrder = async (req, res) => {
  const { amount, userId, type } = req.body;

  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: "INR",
      receipt: `membership_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order.id);

    res.json({ order });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
};

exports.verifyMembershipPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, userId, type, amount, planName, name, email, phone, whatsapp, require80G, address, pan, referral, profession } = req.body;

  try {
    // Skip Razorpay verification for test payments
    const isTestPayment = razorpay_payment_id?.startsWith('test_');

    if (!isTestPayment) {
      // Verify payment with Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (payment.status !== 'captured') {
        return res.status(400).json({ message: 'Payment not captured' });
      }
    }

    // Generate unique 6-digit membership ID
    const memberId = await generateUniqueMemberId();

    // 1. Create a Membership record
    const membership = await prisma.membership.create({
      data: {
        memberId,
        userId: parseInt(userId) || 0,
        name,
        email,
        phone,
        whatsapp,
        type: type,
        planAmount: parseFloat(amount),
        require80G: !!require80G,
        address,
        pan,
        referral,
        profession,
        razorpay_order_id,
        razorpay_payment_id,
        startDate: new Date(),
        endDate: type === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : null,
        status: 'active'
      }
    });

    // 2. Create a Transaction in the ledger
    await prisma.transaction.create({
      data: {
        type: 'pay-in',
        amount: parseFloat(amount),
        transaction_type: 'membership',
        category: planName || type,
        payment_mode: isTestPayment ? 'Test Payment' : 'Razorpay',
        reference_id: razorpay_payment_id,
        description: `Membership Purchase: ${planName || type} by ${name || 'Guest'}${require80G ? ', 80G Requested' : ''}`,
        date: new Date()
      }
    });

    res.json({ message: 'Membership payment verified', membership });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
};
