const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.generateReceipt = async (req, res) => {
  const { donationId } = req.params;

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: parseInt(donationId) }
    });

    if (!donation || donation.status !== 'success') {
      return res.status(404).json({ message: 'Donation not found or not successful' });
    }

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${donationId}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('GAUSHALA DONATION PLATFORM', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('Donation Receipt', { align: 'center' });
    doc.moveDown();

    // Details
    doc.fontSize(12).text(`Receipt ID: R-${donation.id}`);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`);
    doc.text(`Transaction ID: ${donation.razorpay_payment_id}`);
    doc.moveDown();

    doc.text(`Donor Name: ${donation.name}`);
    doc.text(`Email: ${donation.email}`);
    doc.text(`Phone: ${donation.phone}`);
    doc.text(`WhatsApp: ${donation.whatsapp}`);
    doc.moveDown();

    doc.text(`Donation Type: ${donation.type.toUpperCase()}`);
    doc.text(`Quantity: ${donation.quantity}`);
    doc.text(`Total Amount: ₹${donation.amount}`);
    doc.moveDown();

    doc.fontSize(14).text('Thank you for your generous contribution!', { align: 'center' });
    doc.fontSize(10).text('Serving Gau Mata, Earning Divine Blessings.', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
