require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Msp = require('../models/Msp');

// SAMPLE VALUES ONLY. Replace with the official MSP announced by the Government of India
// for the current marketing year (cacp.dacnet.nic.in) before going live, or update them
// via PUT /api/msp as admin.
const YEAR = '2026-27';
const SAMPLE_MSP = [
  { crop: 'Wheat', season: 'rabi', pricePerQuintal: 2500 },
  { crop: 'Paddy', season: 'kharif', pricePerQuintal: 2400 },
  { crop: 'Maize', season: 'kharif', pricePerQuintal: 2300 },
  { crop: 'Soybean', season: 'kharif', pricePerQuintal: 5000 },
  { crop: 'Gram', season: 'rabi', pricePerQuintal: 5900 },
  { crop: 'Mustard', season: 'rabi', pricePerQuintal: 6000 },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const m of SAMPLE_MSP) {
    await Msp.updateOne({ crop: m.crop }, { ...m, marketingYear: YEAR }, { upsert: true });
  }
  console.log(`Seeded ${SAMPLE_MSP.length} sample MSP rates`);

  const email = (process.env.ADMIN_EMAIL || 'admin@krishisewak.in').toLowerCase();
  if (!(await User.exists({ email }))) {
    await User.create({
      name: 'Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'ChangeMe@123',
      role: 'admin',
      verificationStatus: 'verified',
    });
    console.log(`Created admin ${email}`);
  } else {
    console.log('Admin already exists');
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
