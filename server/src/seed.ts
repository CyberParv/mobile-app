import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const password = await bcrypt.hash('password123', 12);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password,
      name: 'Test User',
      refreshTokens: {
        create: [{
          token: 'sample-refresh-token',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }]
      }
    }
  });
  console.log('Database seeded');
};

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});