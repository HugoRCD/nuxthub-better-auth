export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, options } = useAuth()
  
  if (!loggedIn.value) {
    return navigateTo(options.redirectGuestTo || '/')
  }
  
  if (to.path !== '/onboarding') {
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
