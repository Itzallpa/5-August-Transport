const { execSync } = require("child_process");

if (process.env.NEXT_PRIVATE_STANDALONE === "true") {
  // Inside OpenNext: build Next.js application
  console.log("==> Building Next.js app inside OpenNext...");
  execSync("npx prisma generate && npx next build", { stdio: "inherit" });
} else if (process.env.BUILD_TARGET === "vps") {
  // Standard Next.js build for Linux VPS
  console.log("==> Building Next.js app for Linux VPS...");
  execSync("npx prisma generate && npx next build", { stdio: "inherit" });
} else {
  // Top-level build invoked by Cloudflare (npm run build)
  console.log("==> Building OpenNext Cloudflare bundle...");
  execSync("npx prisma generate && npx opennextjs-cloudflare build", { stdio: "inherit" });
}

