import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

/**
 * CLI script to create an initial admin user for NewStarSports.
 * Run via: npx tsx scripts/create-admin.ts <email> <password> <full_name>
 */

async function main() {
  const [email, password, fullName] = process.argv.slice(2);

  if (!email || !password || !fullName) {
    console.log("Usage: npx tsx scripts/create-admin.ts <email> <password> <full_name>");
    process.exit(1);
  }

  // Read .env.local from apps/admin
  const envPath = path.join(process.cwd(), "apps", "admin", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Error: apps/admin/.env.local not found.");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Creating admin user: ${email}...`);

  // 1. Create Auth User
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error("Error creating auth user:", authError.message);
    process.exit(1);
  }

  const userId = authUser.user.id;
  console.log(`Auth user created successfully (ID: ${userId})`);

  // 2. Create Staff Member Record
  const { error: staffError } = await supabase
    .from("staff_members")
    .insert({
      user_id: userId,
      full_name: fullName,
      email: email,
      role: "super_admin",
      is_active: true,
    });

  if (staffError) {
    console.error("Error creating staff record:", staffError.message);
    // Cleanup auth user if staff record fails
    await supabase.auth.admin.deleteUser(userId);
    process.exit(1);
  }

  console.log(`Admin record created in staff_members table.`);
  console.log(`Successfully created super_admin: ${fullName}`);
  console.log(`You can now log in at http://localhost:3001/login`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
