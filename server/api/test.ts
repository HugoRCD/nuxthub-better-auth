import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const auth = serverAuth()
  const session = await auth.api.listSessions({
    // @ts-expect-error - getHeaders is not typed correctly
    headers: getHeaders(event)
  })
  return session
})
