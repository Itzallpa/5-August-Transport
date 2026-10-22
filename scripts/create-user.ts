import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/security";

async function main() {
  const args = process.argv.slice(2);
  const username = args[0]?.trim();
  const password = args[1]?.trim();
  const role = (args[2]?.trim() || "ADMIN").toUpperCase();

  if (!username || !password) {
    console.log("\n=============================================");
    console.log(" 5 August Transport - Admin User Generator");
    console.log("=============================================");
    console.log("Usage: npm run create-user -- <username> <password> [role]");
    console.log("Example: npm run create-user -- admin2 mypass123 ADMIN\n");
    process.exit(1);
  }

  if (username.length < 3) {
    console.error("Error: Username must be at least 3 characters long.");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Error: Password must be at least 6 characters long.");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    console.error(`Error: User "${username}" already exists!`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.adminUser.create({
    data: {
      username,
      passwordHash,
      role,
    },
  });

  console.log("\n✓ User created successfully!");
  console.log(`- Username: ${user.username}`);
  console.log(`- Role:     ${user.role}`);
  console.log(`- Created:  ${user.createdAt.toISOString()}\n`);
}

main()
  .catch((e) => {
    console.error("Error creating user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
