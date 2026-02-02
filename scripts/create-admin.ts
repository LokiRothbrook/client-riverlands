/**
 * Bootstrap script: Create the first admin user.
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/create-admin.ts <email> [full_name]
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
 * to be set in .env.local.
 *
 * This script:
 * 1. Creates a Supabase Auth user via the admin API (inviteUserByEmail)
 * 2. Sets their profile role to "admin"
 *
 * The user will receive an email invite to set their password.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  console.error(
    "Run with: npx tsx --env-file .env.local scripts/create-admin.ts <email>"
  );
  process.exit(1);
}

const email = process.argv[2];
const fullName = process.argv[3] || "";

if (!email) {
  console.error(
    "Usage: npx tsx --env-file .env.local scripts/create-admin.ts <email> [full_name]"
  );
  process.exit(1);
}

async function main() {
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Inviting ${email} as admin...`);

  // Invite the user (sends email with magic link to set password)
  const { data: inviteData, error: inviteError } =
    await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
    });

  if (inviteError) {
    console.error("Failed to invite user:", inviteError.message);
    process.exit(1);
  }

  const userId = inviteData.user?.id;
  if (!userId) {
    console.error("Invite succeeded but no user ID returned.");
    process.exit(1);
  }

  console.log(`User created with ID: ${userId}`);

  // Set role to admin in profiles table
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin", full_name: fullName || null })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to set admin role:", updateError.message);
    console.error(
      "The user was created but has the default 'viewer' role.",
      "You can manually update their role in the Supabase dashboard."
    );
    process.exit(1);
  }

  console.log(`Done. ${email} is now an admin.`);
  console.log("They will receive an email invite to set their password.");
}

main();
