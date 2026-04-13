import { db } from './index';
import { iems, cables, iemToCables } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Insert IEMs
  const insertedIems = await db.insert(iems).values([
    { brand: '7Hz', model: 'Elua Ultra', connector: '0.78mm' },
    { brand: 'Truthear', model: 'Zero:Blue', connector: '0.78mm' },
    { brand: 'KZ', model: 'ZSN Pro X', connector: 'QDC' },
  ]).returning();

  // 2. Insert Cables
  const insertedCables = await db.insert(cables).values([
    { name: 'Moondrop MC2', connector: '0.78mm', material: 'Silver-plated Copper' },
    { name: 'Tripowin Grace', connector: '0.78mm', material: 'Silver-plated OFC' },
    { name: 'Tripowin Zonie', connector: 'QDC', material: 'Silver-plated' },
  ]).returning();

  // 3. Link them (Many-to-Many)
  // Mapping the Elua Ultra (index 0) to the MC2 (index 0)
  await db.insert(iemToCables).values([
    { iemId: insertedIems[0].id, cableId: insertedCables[0].id },
    { iemId: insertedIems[0].id, cableId: insertedCables[1].id },
    { iemId: insertedIems[1].id, cableId: insertedCables[0].id },
  ]);

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});