import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password,
      name: 'Test User'
    }
  });

  await prisma.entity.create({
    data: {
      name: 'Sample Entity',
      userId: user.id
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });