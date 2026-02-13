import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      entities: {
        create: [{ name: 'Sample Entity' }]
      }
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });