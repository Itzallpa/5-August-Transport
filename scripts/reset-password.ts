import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/security";

async function main() {
  const username = (process.argv[2] || "admin").trim();
  const newPassword = (process.argv[3] || "admin123").trim();

  console.log(`\n==> Resetting password for user: "${username}" to: "${newPassword}"...`);

  const passwordHash = await hashPassword(newPassword);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      username,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✓ SUCCESS: Admin credentials set!");
  console.log(`  - Username: ${user.username}`);
  console.log(`  - Password: ${newPassword}`);
  console.log(`  - Role:     ${user.role}\n`);
}

main()
  .catch((e) => {
    console.error("Error resetting password:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
