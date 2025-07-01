import { eq } from 'drizzle-orm'
import { notes, user } from '../../database/schema'

export default eventHandler(async () => {
  const notesWithUser = await useDrizzle()
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      done: notes.done,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      }
    })
    .from(notes)
    .innerJoin(user, eq(notes.userId, user.id))
    .orderBy(notes.createdAt)

  return notesWithUser
})
