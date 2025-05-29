export default eventHandler(async () => {
  const notes = await useDrizzle().select().from(tables.notes).all()

  return notes
})
