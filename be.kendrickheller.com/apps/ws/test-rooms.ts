import { prisma } from '@kendrickheller/core';

async function main() {
    const adminRole = await prisma.role.findFirst({
        where: { roleName: 'ADMIN' }
    });
    const adminUserRoles = await prisma.userRole.findMany({
        where: { roleId: adminRole?.roleId }
    });
    console.log("Admin User IDs:", adminUserRoles.map(a => a.userId));
}

main().catch(console.error).finally(() => prisma.$disconnect());
