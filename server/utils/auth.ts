import { betterAuth } from 'better-auth'
import { anonymous, admin, organization } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schema'

let _auth: ReturnType<typeof betterAuth>

export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: drizzleAdapter(
        drizzle({
          connection: {
            connectionString: process.env.DATABASE_URL
          },
          schema
        }),
        {
          provider: 'pg',
          schema
        }
      ),
      secondaryStorage: {
        get: async key => {
          console.log('get', key)
          return await useStorage().getItem(`_auth:${key}`) as Promise<string | null>
        },
        set: async (key, value, ttl) => {
          console.log('set', key, value, ttl)
          return await useStorage().setItem(`_auth:${key}`, value, { ttl })
        },
        delete: async key => await useStorage().removeItem(`_auth:${key}`),
      },
      baseURL: getBaseURL(),
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      },
      account: {
        accountLinking: {
          enabled: true,
        },
      },
      plugins: [anonymous(), admin(), organization()],
      databaseHooks: {
        session: {
          create: {
            before: async (session) => {
              console.log('session', session)
              // TODO: implement
              /* const organization = await getActiveOrganization(session.userId)
              return {
                data: {
                  ...session,
                  activeOrganizationId: organization.id
                }
              } */
            }
          }
        }
      }
    })
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    } catch (e) { /* empty */ }
  }
  return baseURL
}

_auth = serverAuth()

export const auth = _auth!
