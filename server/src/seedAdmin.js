const User = require('./models/user');

async function seedAdmin() {
  const adminMsisdn = process.env.ADMIN_MSISDN || '0000000001';
  const admin = await User.findOne({ msisdn: adminMsisdn });
  if (!admin) {
    await User.create({
      msisdn: adminMsisdn,
      provider: 'vodacom',
      airtime: 9999,
      isAdmin: true
    });
    // eslint-disable-next-line no-console
    console.log('Admin user seeded:', adminMsisdn);
  } else if (!admin.isAdmin) {
    admin.isAdmin = true;
    await admin.save();
    // eslint-disable-next-line no-console
    console.log('Admin user updated to isAdmin:', adminMsisdn);
  }
}

module.exports = seedAdmin;
