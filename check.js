const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const files = await prisma.file.findMany({ 
    where: { deleteFlg: 0, fileTypeId: 1 }, 
    orderBy: { fileId: 'desc' } 
  });
  console.log('Total images:', files.length);
  
  const nullObjectFiles = files.filter(f => f.objectType === null && !f.systemName.startsWith('file-'));
  console.log('Old images with null objectType:', nullObjectFiles.length);
  console.log('Sample old null images:', nullObjectFiles.slice(0, 5).map(f => f.systemName));
}

main().catch(console.error).finally(() => prisma.$disconnect());
