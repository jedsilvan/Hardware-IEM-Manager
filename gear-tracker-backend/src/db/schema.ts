import { pgTable, serial, text, integer, pgEnum, primaryKey } from 'drizzle-orm/pg-core';

// Enum for IEM/Cable compatibility
export const connectorEnum = pgEnum('connector_type', ['0.78mm', 'MMCX', 'QDC']);

export const iems = pgTable('iems', {
  id: serial('id').primaryKey(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  connector: connectorEnum('connector').notNull(),
});

export const cables = pgTable('cables', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  connector: connectorEnum('connector').notNull(),
  material: text('material'), // e.g., Silver-plated, Copper
});

// Join table for Many-to-Many relationship
export const iemToCables = pgTable('iem_to_cables', {
  iemId: integer('iem_id').references(() => iems.id),
  cableId: integer('cable_id').references(() => cables.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.iemId, t.cableId] }),
}));