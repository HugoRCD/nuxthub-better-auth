export default eventHandler(async (event) => {
  const { title, content, userId } = await readBody(event)

  console.log(`Creating note for user ${userId}`)

  const note = await useDrizzle().insert(tables.notes).values({
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning().get()

  return note
})
