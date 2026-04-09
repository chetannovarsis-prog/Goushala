const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Gurukul Applications
exports.apply = async (req, res) => {
  const { studentName, age, parentName, phone, whatsapp, address, education, profession, referral } = req.body;
  try {
    const application = await prisma.gurukulApplication.create({
      data: {
        studentName,
        age: parseInt(age),
        parentName,
        phone,
        whatsapp,
        address,
        education,
        profession,
        referral,
        status: 'pending'
      }
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await prisma.gurukulApplication.findMany();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const application = await prisma.gurukulApplication.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    // If approved, maybe add as student automatically
    if (status === 'approved') {
      await prisma.student.create({
        data: { name: application.studentName, details: `Parent: ${application.parentName}, Phone: ${application.phone}` }
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
