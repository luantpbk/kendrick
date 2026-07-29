const { prisma } = require('@kendrickheller/core');
prisma.product.updateMany({ where: { deleteFlg: null }, data: { deleteFlg: 0 } })
  .then(res => console.log('Fixed', res.count, 'products'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
