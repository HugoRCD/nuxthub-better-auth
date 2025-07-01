export default eventHandler(async (event) => {
  const { team } = await requireTeam(event)

  const notesWithUser = await useDrizzle().query.notes.findMany({
    where: (notes, { eq }) => eq(notes.organizationId, team.id),
    with: {
      user: true
    },
    orderBy: (notes, { desc }) => desc(notes.createdAt)
  })

  return notesWithUser
})
