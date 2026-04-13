import express, { Request, Response } from 'express';
import { db } from './db';
import { iems, cables, iemToCables } from './db/schema';
import { z } from 'zod';

const app = express();
app.use(express.json());

const IEMSchema = z.object({
  brand: z.string(),
  model: z.string(),
  connector: z.enum(['0.78mm', 'MMCX', 'QDC']),
});

const CableSchema = z.object({
  name: z.string(),
  connector: z.enum(['0.78mm', 'MMCX', 'QDC']),
  material: z.string().optional(),
});

const LinkCableSchema = z.object({
  iemId: z.number(),
  cableId: z.number(),
});

app.post('/iems', async (req: Request, res: Response) => {
  try {
    const validatedData = IEMSchema.parse(req.body);
    const newIem = await db.insert(iems).values(validatedData).returning();
    res.status(201).json(newIem);
  } catch (error) {
    res.status(400).json({ error: 'Invalid IEM data' });
  }
});

app.post('/cables', async (req: Request, res: Response) => {
  try {
    const validatedData = CableSchema.parse(req.body);
    const newCable = await db.insert(cables).values(validatedData).returning();
    res.status(201).json(newCable);
  } catch (error) {
    res.status(400).json({ error: 'Invalid cable data' });
  }
});

app.post('/iems/:iemId/cables/:cableId', async (req: Request, res: Response) => {
  try {
    const { iemId, cableId } = req.params as { iemId: string; cableId: string };
    const validatedData = LinkCableSchema.parse({
      iemId: parseInt(iemId),
      cableId: parseInt(cableId),
    });
    await db.insert(iemToCables).values(validatedData);
    res.status(201).json({ message: 'Cable linked to IEM' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to link cable to IEM' });
  }
});