const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.roleFunction.findMany({ where: { roleId: 1 }, take: 10 }).then(console.log).finally(() => prisma.$disconnect());
