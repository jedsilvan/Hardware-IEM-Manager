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
    { brand: '7Hz', model: 'Elua Ultra', connector: '0.78mm', image: 'https://images.crutchfield.com/products/large_487f41ff0c054827.jpg' },
    { brand: 'Truthear', model: 'Zero:Blue', connector: '0.78mm', image: 'https://m.media-amazon.com/images/I/71SJ2bBEhJL._AC_SL1500_.jpg' },
    { brand: 'KZ', model: 'ZSN Pro X', connector: 'QDC', image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd7559db44d6a49e4a0c48b27d42f45f0R.jpg' },
    { brand: 'Moondrop', model: 'Blessing 2', connector: '0.78mm', image: 'https://images.crutchfield.com/products/large_487f41ff0c054796.jpg' },
    { brand: 'Tin HiFi', model: 'T3 Plus', connector: '0.78mm', image: 'https://m.media-amazon.com/images/I/61oQyV2yPdL._AC_SL1000_.jpg' },
    { brand: 'CCA', model: 'CRA', connector: 'QDC', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0e3d52a7a7544819bbbde9e882bb0c1eX.jpg' },
    { brand: 'FiiO', model: 'FH3', connector: 'MMCX', image: 'https://m.media-amazon.com/images/I/61Y3BkqXfIL._AC_SL1000_.jpg' },
    { brand: 'Shure', model: 'SE215', connector: 'MMCX', image: 'https://m.media-amazon.com/images/I/51qxBEpRKaL._AC_SL1000_.jpg' },
  ]).returning();

  // 2. Insert Cables
  const insertedCables = await db.insert(cables).values([
    { name: 'Moondrop MC2', connector: '0.78mm', material: 'Silver-plated Copper', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7d1d8e4f7c364b0aa6f3b8e2c5d9f1a2b.jpg' },
    { name: 'Tripowin Grace', connector: '0.78mm', material: 'Silver-plated OFC', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4e2f8c1b3a5d9f6e7c8b0a4d2e1f3g5h.jpg' },
    { name: 'Tripowin Zonie', connector: 'QDC', material: 'Silver-plated', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S3f1a2b5c8d9e0g4h6i2j7k3l5m9o1p2q.jpg' },
    { name: 'FiiO LC-RE Pro', connector: 'MMCX', material: 'Pure Silver', image: 'https://m.media-amazon.com/images/I/41X7nEXR3gL._AC_.jpg' },
    { name: 'KZ SPC Cable', connector: 'QDC', material: 'Silver-plated Copper', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S2e4f9c3b1a7d5f8e0g6h2i9j1k5l3m7n.jpg' },
    { name: 'Shure RMCE-BT2', connector: 'MMCX', material: 'Bluetooth', image: 'https://m.media-amazon.com/images/I/31Y9aXCvF1L._AC_.jpg' },
    { name: 'Linsoul Tripowin Jelly', connector: '0.78mm', material: 'Hybrid', image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6c3e7f2b9a4d1f5e8g0h3i6j2k9l1m5n.jpg' },
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