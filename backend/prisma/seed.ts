import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.employee.findUnique({
    where: {
      email: 'admin@gmail.com',
    },
  });

  if (admin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.employee.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Admin created successfully');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });