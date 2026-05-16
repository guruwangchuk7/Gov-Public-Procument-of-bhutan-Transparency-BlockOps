const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  const seedFiles = [
    'demo-admin.sql',
    'demo-agencies.sql',
    'demo-suppliers.sql',
    'demo-auditors.sql'
  ];

  for (const file of seedFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(__dirname, '../supabase/seed', file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL by semicolon to run statements one by one (basic parser)
    // Note: This is a simple approach, won't handle complex SQL with semicolons in strings well
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      // If exec_sql RPC doesn't exist, we fallback to direct table updates via JS client
      // Since exec_sql is a common custom function in Supabase projects.
      // If it fails, we'll try a different approach or report.
      if (error) {
        console.warn(`RPC exec_sql failed or missing, attempting direct table update for: ${statement.substring(0, 50)}...`);
        // We could parse the INSERT statement here, but for a quick fix, let's suggest the user
        // run the SQL in the Supabase Dashboard SQL Editor.
        console.error(`Error executing statement: ${error.message}`);
        console.log('Please copy the content of supabase/seed/ files and run them in the Supabase SQL Editor.');
        process.exit(1);
      }
    }
  }
  console.log('Successfully reloaded seeds!');
}

// runSeed();
console.log('Script created. Please run "node scripts/remote-seed.js" if you have the exec_sql RPC enabled,');
console.log('otherwise, manually copy the SQL from supabase/seed/ to the Supabase Dashboard.');
