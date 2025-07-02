export default defineNuxtRouteMiddleware(() => {
  const toast = useToast()
  const { loggedIn, user, options } = useAuth()
  
  if (!loggedIn.value) {
    return navigateTo(options.redirectGuestTo || '/')
  }
  
  if ((user.value as any)?.role !== 'admin') {
    toast.add({
      title: 'You are not authorized to access this page',
      color: 'error'
    })
    return navigateTo('/app/user')
  }
}) 
