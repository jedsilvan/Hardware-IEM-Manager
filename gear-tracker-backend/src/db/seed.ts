import { db } from './index';
import { iems, cables, iemToCables } from './schema';

async function seed() {
  // Clear tables before seeding
  await db.delete(iemToCables);
  await db.delete(cables);
  await db.delete(iems);

  console.log('🌱 Seeding database...');

  // 1. Insert IEMs
  const insertedIems = await db.insert(iems).values([
    { brand: '7Hz', model: 'Elua Ultra', connector: '0.78mm' },
    { brand: 'Truthear', model: 'Zero:Blue', connector: '0.78mm' },
    { brand: 'KZ', model: 'ZSN Pro X', connector: 'QDC' },
    { brand: 'Moondrop', model: 'Blessing 2', connector: '0.78mm' },
    { brand: 'Tin HiFi', model: 'T3 Plus', connector: '0.78mm' },
    { brand: 'CCA', model: 'CRA', connector: 'QDC' },
    { brand: 'FiiO', model: 'FH3', connector: 'MMCX' },
    { brand: 'Shure', model: 'SE215', connector: 'MMCX' },
  ]).returning();

  // 2. Insert Cables
  const insertedCables = await db.insert(cables).values([
    { name: 'Moondrop MC2', connector: '0.78mm', material: 'Silver-plated Copper' },
    { name: 'Tripowin Grace', connector: '0.78mm', material: 'Silver-plated OFC' },
    { name: 'Tripowin Zonie', connector: 'QDC', material: 'Silver-plated' },
    { name: 'FiiO LC-RE Pro', connector: 'MMCX', material: 'Pure Silver' },
    { name: 'KZ SPC Cable', connector: 'QDC', material: 'Silver-plated Copper' },
    { name: 'Shure RMCE-BT2', connector: 'MMCX', material: 'Bluetooth' },
    { name: 'Linsoul Tripowin Jelly', connector: '0.78mm', material: 'Hybrid' },
  ]).returning();

  // 3. Link them (Many-to-Many)
  // Only link IEMs and cables with matching connector types
  const iemCableLinks: { iemId: number; cableId: number }[] = [];
  insertedIems.forEach(iem => {
    insertedCables.forEach(cable => {
      if (iem.connector === cable.connector) {
        iemCableLinks.push({ iemId: iem.id, cableId: cable.id });
      }
    });
  });
  await db.insert(iemToCables).values(iemCableLinks);

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});