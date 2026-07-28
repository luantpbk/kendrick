import { prisma } from '@kendrickheller/core';

afterAll(async () => {
    await prisma.$disconnect();
});
