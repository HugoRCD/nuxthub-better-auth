export default eventHandler(async () => {
  const notesWithUser = await useDrizzle().query.notes.findMany({
    with: {
      user: true
    }
  })

  return notesWithUser
})
