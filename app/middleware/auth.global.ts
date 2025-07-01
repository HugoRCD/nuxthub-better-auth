import { defu } from 'defu'
import { until } from '@vueuse/core'

type MiddlewareOptions = false | {
  /**
   * Only apply auth middleware to guest or user
   */
  only?: 'guest' | 'user' | 'admin'
  /**
   * Redirect authenticated user to this route
   */
  redirectUserTo?: string
  /**
   * Redirect guest to this route
   */
  redirectGuestTo?: string
}

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const toast = useToast()
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, options, fetchSession, user } = useAuth()
  const { only, redirectUserTo, redirectGuestTo } = defu(to.meta?.auth, options)

  // If guest mode, redirect if authenticated
  if (only === 'guest' && loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectUserTo) {
      return
    }
    return navigateTo(redirectUserTo)
  }

  // If client-side, fetch session between each navigation
  if (import.meta.client) {
    await fetchSession()
  }
  // If not authenticated, redirect to home
  if (!loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectGuestTo) {
      return
    }
    return navigateTo(redirectGuestTo)
  }

  if (only === 'admin' && (user.value as any)?.role !== 'admin') {
    toast.add({
      title: 'You are not authorized to access this page',
      color: 'error'
    })
    return navigateTo('/')
  }

  if (loggedIn.value && to.path !== '/onboarding') {
    const { organizations, isLoading, fetchOrganizations } = useOrgs()
    
    if (organizations.value.length === 0 && !isLoading.value) {
      await fetchOrganizations()
    }
    
    if (!organizations.value || organizations.value.length === 0) {
      console.log('User needs onboarding, redirecting...')
      return navigateTo('/onboarding')
    }
  }
})
