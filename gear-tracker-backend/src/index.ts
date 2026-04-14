import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './db'
import { iems, cables, iemToCables } from './db/schema'
import { createImageDataUrl, getConnectorAccent } from './db/image'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const app = express()
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000'

app.use(
  cors({
    origin: allowedOrigin,
  })
)
app.use(express.json())

const IEMSchema = z.object({
  brand: z.string(),
  model: z.string(),
  connector: z.enum(['0.78mm', 'MMCX', 'QDC']),
})

const CableSchema = z.object({
  name: z.string(),
  connector: z.enum(['0.78mm', 'MMCX', 'QDC']),
  material: z.string().optional(),
})

const LinkCableSchema = z.object({
  iemId: z.number(),
  cableId: z.number(),
})

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

function mapIemRowsWithCompatibleCables(
  rows: { iem: typeof iems.$inferSelect; cable: typeof cables.$inferSelect | null }[]
) {
  return Array.from(
    rows
      .reduce((iemMap, row) => {
        const existingIem = iemMap.get(row.iem.id)

        if (existingIem) {
          if (row.cable) {
            existingIem.compatibleCables.push(row.cable)
          }

          return iemMap
        }

        iemMap.set(row.iem.id, {
          ...row.iem,
          compatibleCables: row.cable ? [row.cable] : [],
        })

        return iemMap
      }, new Map<number, typeof iems.$inferSelect & { compatibleCables: typeof cables.$inferSelect[] }>())
      .values()
  )
}

app.post('/iems', async (req: Request, res: Response) => {
  try {
    const validatedData = IEMSchema.parse(req.body)
    const newIem = await db
      .insert(iems)
      .values({
        ...validatedData,
        image: createImageDataUrl(
          `${validatedData.brand} ${validatedData.model}`,
          getConnectorAccent(validatedData.connector)
        ),
      })
      .returning()
    res.status(201).json(newIem)
  } catch (error) {
    res.status(400).json({ error: 'Invalid IEM data' })
  }
})

app.patch('/iems/:iemId', async (req: Request, res: Response) => {
  try {
    const iemId = Number(req.params.iemId)

    if (Number.isNaN(iemId)) {
      return res.status(400).json({ error: 'Invalid IEM id' })
    }

    const validatedData = IEMSchema.parse(req.body)
    const [existingIem] = await db.select().from(iems).where(eq(iems.id, iemId)).limit(1)

    if (!existingIem) {
      return res.status(404).json({ error: 'IEM not found' })
    }

    const linkedCables = await db
      .select({ connector: cables.connector })
      .from(iemToCables)
      .innerJoin(cables, eq(iemToCables.cableId, cables.id))
      .where(eq(iemToCables.iemId, iemId))

    const hasConnectorMismatch = linkedCables.some((row) => row.connector !== validatedData.connector)

    if (hasConnectorMismatch) {
      return res.status(400).json({
        error:
          'Cannot change connector while incompatible linked cables exist. Update cable links first.',
      })
    }

    const [updatedIem] = await db
      .update(iems)
      .set({
        ...validatedData,
        image: createImageDataUrl(
          `${validatedData.brand} ${validatedData.model}`,
          getConnectorAccent(validatedData.connector)
        ),
      })
      .where(eq(iems.id, iemId))
      .returning()

    return res.status(200).json(updatedIem)
  } catch (_error) {
    return res.status(400).json({ error: 'Invalid IEM data' })
  }
})

app.post('/cables', async (req: Request, res: Response) => {
  try {
    const validatedData = CableSchema.parse(req.body)
    const newCable = await db
      .insert(cables)
      .values({
        ...validatedData,
        image: createImageDataUrl(validatedData.name, getConnectorAccent(validatedData.connector)),
      })
      .returning()
    res.status(201).json(newCable)
  } catch (error) {
    res.status(400).json({ error: 'Invalid cable data' })
  }
})

app.post('/iems/:iemId/cables/:cableId', async (req: Request, res: Response) => {
  try {
    const { iemId, cableId } = req.params as { iemId: string; cableId: string }
    const validatedData = LinkCableSchema.parse({
      iemId: parseInt(iemId),
      cableId: parseInt(cableId),
    })

    const [iem] = await db.select().from(iems).where(eq(iems.id, validatedData.iemId)).limit(1)
    const [cable] = await db.select().from(cables).where(eq(cables.id, validatedData.cableId)).limit(1)

    if (!iem || !cable) {
      return res.status(404).json({ error: 'IEM or cable not found' })
    }

    if (iem.connector !== cable.connector) {
      return res.status(400).json({ error: 'Cable connector must match the IEM connector type' })
    }

    await db.insert(iemToCables).values(validatedData)
    res.status(201).json({ message: 'Cable linked to IEM' })
  } catch (error) {
    res.status(400).json({ error: 'Failed to link cable to IEM' })
  }
})

app.get('/iems', async (_req: Request, res: Response) => {
  try {
    const iemRows = await db
      .select({
        iem: iems,
        cable: cables,
      })
      .from(iems)
      .leftJoin(iemToCables, eq(iemToCables.iemId, iems.id))
      .leftJoin(cables, eq(iemToCables.cableId, cables.id))

    const allIems = mapIemRowsWithCompatibleCables(iemRows)

    res.status(200).json(allIems)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IEMs' })
  }
})

app.get('/iems/:iemId', async (req: Request, res: Response) => {
  try {
    const iemId = Number(req.params.iemId)

    if (Number.isNaN(iemId)) {
      return res.status(400).json({ error: 'Invalid IEM id' })
    }

    const iemRows = await db
      .select({
        iem: iems,
        cable: cables,
      })
      .from(iems)
      .leftJoin(iemToCables, eq(iemToCables.iemId, iems.id))
      .leftJoin(cables, eq(iemToCables.cableId, cables.id))
      .where(eq(iems.id, iemId))

    const [iem] = mapIemRowsWithCompatibleCables(iemRows)

    if (!iem) {
      return res.status(404).json({ error: 'IEM not found' })
    }

    res.status(200).json(iem)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IEM' })
  }
})

app.get('/cables', async (_req: Request, res: Response) => {
  try {
    const allCables = await db.select().from(cables)
    res.status(200).json(allCables)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cables' })
  }
})

const port = Number(process.env.PORT) || 3001

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
})
