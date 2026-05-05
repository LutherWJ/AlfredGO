import { db } from "../src/server/db";
import { UserModel } from "../src/server/models/user";

const email = Bun.argv[2];
const displayName = Bun.argv[3] || "Admin User";

if (!email) {
  console.error("Usage: bun scripts/create_admin.ts <email> [display_name]");
  process.exit(1);
}

const ssoId = `manual-admin-${Date.now()}`;

try {
  const user = UserModel.create({
    sso_id: ssoId,
    email: email,
    display_name: displayName,
    role: "admin"
  });

  console.log(`Successfully created admin user:`);
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
} catch (err) {
  console.error("Failed to create admin user:", err);
  process.exit(1);
}
