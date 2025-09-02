const User = require('./models/user');

async function seedAdmin() {
  const adminMsisdn = '0000000001'; // Explicitly set admin number as requested
  const admin = await User.findOne({ msisdn: adminMsisdn });
  if (!admin) {
    await User.create({
      msisdn: adminMsisdn,
      name: 'System Administrator',
      provider: 'vodacom',
      airtime: 9999,
      isAdmin: true
    });
    // eslint-disable-next-line no-console
    console.log('Admin user seeded:', adminMsisdn);
  } else if (!admin.isAdmin) {
    admin.isAdmin = true;
    admin.name = admin.name || 'System Administrator';
    await admin.save();
    // eslint-disable-next-line no-console
    console.log('Admin user updated to isAdmin:', adminMsisdn);
  }
}

module.exports = seedAdmin;
