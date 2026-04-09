const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gurukulRoutes = require('./routes/gurukulRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const homeRoutes = require('./routes/homeRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gurukul', gurukulRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/home', homeRoutes);

app.get('/', (req, res) => {
  res.send('Gaushala API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
