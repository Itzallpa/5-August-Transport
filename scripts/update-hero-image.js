const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.siteContent.updateMany({
    data: {
      heroImageUrl: '/images/hero-cover.jpg',
    },
  });
  console.log('Successfully updated siteContent.heroImageUrl to /images/hero-cover.jpg');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
