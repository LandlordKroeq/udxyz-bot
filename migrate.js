// One-time migration: imports vouches.json into PostgreSQL
// Run once with: node migrate.js

import fs from 'fs';
import { initDb, addVouch } from './db.js';

await initDb();

const vouchData = JSON.parse(fs.readFileSync('./vouches.json', 'utf8'));
const vouches = vouchData.vouches;

console.log(`Migrating ${vouches.length} vouches...`);

for (const v of vouches) {
  await addVouch({
    userId: v.userId,
    service: v.service,
    rating: v.rating,
    text: v.text,
    vouchNumber: v.vouchNumber,
    timestamp: v.timestamp
  });
  console.log(`  ✅ Vouch #${v.vouchNumber} — ${v.service} (${v.rating}⭐)`);
}

console.log('Migration complete!');
process.exit(0);
