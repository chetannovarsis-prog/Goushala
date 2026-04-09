const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createQR = async (req, res) => {
  const { amount, type, orderType, userData } = req.body;

  try {
    let orderRecord;
    
    // 1. Create Initial Pending Record based on Order Type
    if (orderType === 'membership') {
      // Generate a 6-digit unique member ID for placeholder
      const memberId = Math.floor(100000 + Math.random() * 900000).toString();
      
      orderRecord = await prisma.membership.create({
        data: {
          memberId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          whatsapp: userData.whatsapp,
          type: userData.type, // yearly / lifetime
          planAmount: parseFloat(amount),
          status: 'pending',
          payment_status: 'pending',
          require80G: !!userData.require80G,
          address: userData.address,
          pan: userData.pan,
          referral: userData.referral,
          profession: userData.profession,
        }
      });
    } else {
      // Donation (Cow / Bhandara)
      orderRecord = await prisma.donation.create({
        data: {
          name: userData.name,
          phone: userData.phone,
          whatsapp: userData.whatsapp,
          email: userData.email,
          type: userData.type, // cow / bhandara
          quantity: parseInt(userData.quantity) || 1,
          amount: parseFloat(amount),
          status: 'pending',
          require80G: !!userData.require80G,
          address: userData.address,
          pan: userData.pan,
          referral: userData.referral,
          profession: userData.profession,
        }
      });
    }

    // 2. Create Razorpay QR Code
    const expiryTime = Math.floor(Date.now() / 1000) + (5 * 60); // 5 minutes from now
    
    const qrOptions = {
      type: 'upi_qr',
      name: 'Goushala Seva Kendra',
      usage: 'single_use',
      fixed_amount: type === 'fixed' ? true : false,
      payment_amount: type === 'fixed' ? Math.round(amount * 100) : undefined,
      description: `Payment for ${orderType} - ${orderRecord.id}`,
      close_by: expiryTime,
      notes: {
        orderId: orderRecord.id.toString(),
        orderType: orderType
      }
    };

    const qrcode = await razorpay.qrCode.create(qrOptions);

    // 3. Update Record with QR ID
    if (orderType === 'membership') {
      await prisma.membership.update({
        where: { id: orderRecord.id },
        data: { qr_id: qrcode.id }
      });
    } else {
      await prisma.donation.update({
        where: { id: orderRecord.id },
        data: { qr_id: qrcode.id }
      });
    }

    res.json({
      qr_image_url: qrcode.image_url,
      qr_id: qrcode.id,
      expiry_time: expiryTime,
      orderId: orderRecord.id
    });

  } catch (error) {
    console.error('QR Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const { qr_id } = req.params;

  try {
    // First check our database
    let order = await prisma.donation.findFirst({ where: { qr_id } });
    let type = 'donation';
    
    if (!order) {
      order = await prisma.membership.findFirst({ where: { qr_id } });
      type = 'membership';
    }

    if (!order) {
      return res.status(404).json({ message: 'QR ID not found' });
    }

    const currentStatus = type === 'membership' ? order.payment_status : order.status;

    if (currentStatus === 'success') {
      return res.json({ status: 'paid', details: order });
    }

    // Fallback: Check Razorpay directly if still pending in DB
    // (In case webhook hasn't arrived yet)
    const qrDetails = await razorpay.qrCode.fetch(qr_id);
    
    // Note: status 'closed' doesn't mean paid. We need to check payments.
    // For single_use QR, once paid it might close.
    // However, status polling usually relies on the webhook updating the DB.
    
    res.json({ 
      status: currentStatus === 'success' ? 'paid' : 'pending',
      details: order 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  
  // Skip verification if secret is not set (as requested by user)
  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const qr_id = payment.notes ? payment.notes.qr_id : null; 
    // Razorpay usually sends qr_id in the payment entity if it was a QR payment
    const actual_qr_id = payment.qr_code_id || qr_id;

    if (actual_qr_id) {
      try {
        // Try Donation first
        let order = await prisma.donation.findFirst({ where: { qr_id: actual_qr_id } });
        let orderType = 'donation';

        if (!order) {
          order = await prisma.membership.findFirst({ where: { qr_id: actual_qr_id } });
          orderType = 'membership';
        }

        if (order) {
          if (orderType === 'donation') {
            await prisma.donation.update({
              where: { id: order.id },
              data: { status: 'success', razorpay_payment_id: payment.id }
            });
            
            // Log transaction
            await prisma.transaction.create({
              data: {
                type: 'pay-in',
                amount: order.amount,
                transaction_type: 'donation',
                category: order.type,
                payment_mode: 'UPI-QR',
                reference_id: payment.id,
                description: `Online donation via QR from ${order.name}`,
                date: new Date()
              }
            });
          } else {
            await prisma.membership.update({
              where: { id: order.id },
              data: { 
                payment_status: 'success', 
                status: 'active', // Mark membership as active
                razorpay_payment_id: payment.id 
              }
            });

            // Log transaction
            await prisma.transaction.create({
              data: {
                type: 'pay-in',
                amount: order.planAmount,
                transaction_type: 'membership',
                category: order.type,
                payment_mode: 'UPI-QR',
                reference_id: payment.id,
                description: `Membership payment via QR from ${order.name}`,
                date: new Date()
              }
            });
          }
        }
      } catch (err) {
        console.error('Webhook processing error:', err);
      }
    }
  }

  res.json({ status: 'ok' });
};
