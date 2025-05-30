import { z } from 'zod'

export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  await useDrizzle().delete(tables.notes).where(eq(tables.notes.id, +id))

  return { success: true }
})
