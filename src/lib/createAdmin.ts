import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeW93YWpydm93dXhob2txanp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2MTkxMSwiZXhwIjoyMDY2NDM3OTExfQ.qWfwRImPQERh816tOjlju2rvkGOHtU7anEaPs4MGRXY";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase URL or service role key is missing.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminEmail = 'softwaresfortress@gmail.com';
const adminPassword = 'zentara2025inc';

async function ensureAdminUser() {
  // Check if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const adminUser = users.find(user => user.email === adminEmail);

  if (adminUser) {
    // User exists, update password
    console.log('Admin user found. Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: adminPassword }
    );

    if (updateError) {
      console.error('Error updating admin user:', updateError);
    } else {
      console.log('Admin user password updated successfully:');
    }
  } else {
    // User does not exist, create it
    console.log('Admin user not found. Creating new admin user...');
    const { error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (createError) {
      console.error('Error creating admin user:', createError);
    } else {
      console.log('Admin user created successfully:');
    }
  }
}

ensureAdminUser();