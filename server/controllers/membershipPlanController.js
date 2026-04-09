const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      orderBy: { price: 'asc' }
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlan = async (req, res) => {
  const { name, type, price, description, benefits } = req.body;
  try {
    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        type,
        price: parseFloat(price),
        description,
        benefits: Array.isArray(benefits) ? benefits : []
      }
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, type, price, description, benefits } = req.body;
  try {
    const plan = await prisma.membershipPlan.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        price: parseFloat(price),
        description,
        benefits: Array.isArray(benefits) ? benefits : []
      }
    });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.membershipPlan.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
