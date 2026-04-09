const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateCertificate = async (req, res) => {
  const { type, id } = req.params; // type: 'membership' or 'donation'

  try {
    let data;
    if (type === 'membership') {
      data = await prisma.membership.findUnique({ where: { id: parseInt(id) } });
    } else {
      data = await prisma.donation.findUnique({ where: { id: parseInt(id) } });
    }

    if (!data) return res.status(404).json({ error: 'Record not found' });

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 50 });

    // Stream PDF to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_receipt_${id}.pdf"`);

    doc.pipe(res);

    try {
      // --- Certificate Design ---

      // Background Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#FF9933');
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke('#2E7D32');

      // Logo & Header
      const logoPath = path.join(__dirname, '../../client/public/Images/4.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 50, { width: 60 });
      }

      doc.font('Helvetica-Bold').fontSize(22).fillColor('#4D2D0E').text('SHRI BHARDWAJ SEVA KENDRA', 140, 60);
      doc.fontSize(10).fillColor('#666').text('Village: Goshala Name, City, State - PIN', 140, 90);
      doc.text('Reg No: BK/2024/12345 | Contact: +91 1234567890', 140, 105);
      doc.text('Email: info@gaushala.com | Website: www.gaushala.com', 140, 120);

      doc.moveDown(4);

      // Title
      doc.font('Helvetica-Bold').fontSize(36).fillColor('#4D2D0E').text(
        type === 'membership' ? 'CERTIFICATE OF MEMBERSHIP' : 'OFFICIAL DONATION RECEIPT',
        { align: 'center' }
      );

      doc.moveDown(1);
      doc.font('Helvetica').fontSize(16).fillColor('#666').text(
        type === 'membership' ? 'This is to proudly certify that' : 'This receipt is gratefully issued to',
        { align: 'center' }
      );

      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(28).fillColor('#FF9933').text(
        (data.name || 'GUEST').toUpperCase(),
        { align: 'center' }
      );

      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(14).fillColor('#666').text(
        type === 'membership'
          ? `has joined as a ${data.planName || data.type} member.`
          : `for their generous contribution of INR ${data.amount.toLocaleString()} towards ${data.type} service.`,
        { align: 'center' }
      );

      // 80G Section
      if (data.require80G) {
        doc.moveDown(2);
        doc.rect(50, doc.y, doc.page.width - 100, 80).fill('#F9FAFB').stroke('#E5E7EB');
        doc.fillColor('#4D2D0E').font('Helvetica-Bold').fontSize(12).text('80G TAX EXEMPTION DETAILS', 70, doc.y - 70);
        doc.font('Helvetica').fontSize(10).fillColor('#374151');
        doc.text(`PAN: ${data.pan || 'N/A'}`, 70, doc.y - 50);
        doc.text(`Address: ${data.address || 'N/A'}`, 70, doc.y - 35, { width: 400 });
        doc.moveDown(2);
      }

      doc.moveDown(1.5);
      doc.fontSize(12).fillColor('#999').text(
        `Date: ${new Date(data.createdAt).toLocaleDateString()} | Receipt No: ${type === 'membership' ? 'MEM' : 'DON'}-${id}`,
        { align: 'center' }
      );



      doc.moveDown(2);
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#4D2D0E').text(
        'Authorized Signatory',
        { align: 'center' }
      );
      const signaturePath = path.join(__dirname, '../../client/public/Images/signature.png');
      if (fs.existsSync(signaturePath)) {
        const signatureWidth = 120;
        const signatureX = (doc.page.width - signatureWidth) / 2;
        doc.image(signaturePath, signatureX, doc.y + 15, { width: signatureWidth });
        doc.moveDown(6);
      }
      // Decorative Footer
      doc.rect(0, doc.page.height - 10, doc.page.width, 10).fill('#FF9933');
      doc.rect(doc.page.width / 2 - 50, doc.page.height - 10, 100, 10).fill('#2E7D32');

      doc.end();
    } catch (innerErr) {
      console.error('PDF Generation Error:', innerErr);
      doc.end(); // Attempt to close correctly
    }
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

module.exports = { generateCertificate };
