import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../apps/storefront/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase Environment Variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const email = 'test_proper@nss.com';
  const password = 'password123';
  
  console.log('--- Setting up Test User ---');

  // 1. Create/Get User
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  let user = users?.find(u => u.email === email);

  if (!user) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Proper Tester' }
    });
    if (authError) {
      console.error('Auth Create Error:', authError);
      return;
    }
    user = authData.user;
    console.log('Created User:', user?.id);
  } else {
    console.log('User already exists:', user.id);
  }

  const userId = user!.id;

  // 2. Get Governorate and Area
  const { data: gov } = await supabase.from('governorates').select('id').limit(1).single();
  const { data: area } = await supabase.from('areas').select('id, governorate_id').eq('governorate_id', gov?.id).limit(1).single();
  
  if (!gov || !area) {
     console.error('Governorate/Area not found in seed data');
     return;
  }

  // 3. Create Address
  const { error: addrError } = await supabase.from('addresses').upsert({
    user_id: userId,
    recipient_name: 'Proper Tester',
    recipient_phone: '12345678',
    governorate_id: gov.id,
    area_id: area.id,
    block: '1',
    street: 'Test St',
    building: '101',
    is_default: true,
    address_type: 'home'
  }, { onConflict: 'user_id' });

  if (addrError) {
    console.error('Address Error:', addrError);
  } else {
    console.log('Test User and Address Ready for test_proper@nss.com');
  }
}

run();
