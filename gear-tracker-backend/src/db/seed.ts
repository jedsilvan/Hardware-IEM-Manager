import { db } from './index';
import { createImageDataUrl } from './image';
import { iems, cables, iemToCables } from './schema';

async function seed() {
  // Clear tables before seeding
  await db.delete(iemToCables);
  await db.delete(cables);
  await db.delete(iems);

  console.log('🌱 Seeding database...');

  // 1. Insert IEMs
  const insertedIems = await db.insert(iems).values([
    { brand: '7Hz', model: 'Elua Ultra', connector: '0.78mm', image: createImageDataUrl('7Hz Elua Ultra', '#38bdf8') },
    { brand: 'FiiO', model: 'FH3', connector: 'MMCX', image: createImageDataUrl('FiiO FH3', '#f97316') },
    { brand: 'KZ', model: 'ZSN Pro X', connector: 'QDC', image: createImageDataUrl('KZ ZSN Pro X', '#f59e0b') },
    { brand: 'Moondrop', model: 'Blessing 2', connector: '0.78mm', image: createImageDataUrl('Moondrop Blessing 2', '#818cf8') },
    { brand: 'CCA', model: 'CRA', connector: 'QDC', image: createImageDataUrl('CCA CRA', '#fb7185') },
    { brand: 'Tin HiFi', model: 'T3 Plus', connector: '0.78mm', image: createImageDataUrl('Tin HiFi T3 Plus', '#34d399') },
    { brand: 'Shure', model: 'SE215', connector: 'MMCX', image: createImageDataUrl('Shure SE215', '#a78bfa') },
    { brand: 'Truthear', model: 'Zero:Blue', connector: '0.78mm', image: createImageDataUrl('Truthear Zero Blue', '#60a5fa') },
  ]).returning();

  // 2. Insert Cables
  const insertedCables = await db.insert(cables).values([
    { name: 'Moondrop MC2', connector: '0.78mm', material: 'Silver-plated Copper', image: createImageDataUrl('Moondrop MC2', '#38bdf8') },
    { name: 'Tripowin Grace', connector: '0.78mm', material: 'Silver-plated OFC', image: createImageDataUrl('Tripowin Grace', '#10b981') },
    { name: 'Tripowin Zonie', connector: 'QDC', material: 'Silver-plated', image: createImageDataUrl('Tripowin Zonie', '#f59e0b') },
    { name: 'FiiO LC-RE Pro', connector: 'MMCX', material: 'Pure Silver', image: createImageDataUrl('FiiO LC-RE Pro', '#f97316') },
    { name: 'KZ SPC Cable', connector: 'QDC', material: 'Silver-plated Copper', image: createImageDataUrl('KZ SPC Cable', '#ef4444') },
    { name: 'Shure RMCE-BT2', connector: 'MMCX', material: 'Bluetooth', image: createImageDataUrl('Shure RMCE-BT2', '#8b5cf6') },
    { name: 'Linsoul Tripowin Jelly', connector: '0.78mm', material: 'Hybrid', image: createImageDataUrl('Tripowin Jelly', '#06b6d4') },
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