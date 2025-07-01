export default eventHandler(async () => {
  const notes = await useDrizzle().query.notes.findMany()

  return notes
})
