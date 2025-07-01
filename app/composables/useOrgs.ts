import type { FormSubmitEvent } from '@nuxt/ui'
import type { Organization, Member } from 'better-auth/plugins'

export const useCurrentOrganization = () => {
  return useState<Organization | null>('organization', () => null)
}

export function useOrgs() {
  const { client } = useAuth()
  const organization = useCurrentOrganization()
  const activeOrganizationId = useCookie('activeOrganizationId')
  const toast = useToast()

  async function getFullOrganization(orgId?: string) {
    if (!orgId) {
      const { data, error } = await client.organization.getFullOrganization()
      if (error) {
        toast.add({
          title: 'Failed to fetch organization',
          color: 'error'
        })
      }
      return data
    }
    const { data, error } = await client.organization.getFullOrganization({
      query: { organizationId: orgId }
    })
    if (error) {
      toast.add({
        title: 'Failed to fetch organization',
        color: 'error'
      })
    }
    return data
  }

  const { data: organizations, refresh, status } = useAsyncData('organizations', async () => {
    const { data, error } = await client.organization.list()
    if (!data || error) {
      toast.add({
        title: 'Failed to fetch organizations',
        color: 'error'
      })
    }
    return await Promise.all(
        data!.map((org) => getFullOrganization(org.id))
    ) as FullOrganization[]
  })

  const isLoading = computed(() => status.value === 'pending')

  const { refresh: refreshSelectedTeam } = useAsyncData('selectedTeam', async () => {
    organization.value = await getFullOrganization()
    return organization.value
  })

  async function selectTeam(id: string) {
    const { data, error } = await client.organization.setActive({
      organizationId: id
    })
    console.log('selectedTeam', data, error)
    activeOrganizationId.value = id
    refreshSelectedTeam()
    toast.add({
      title: 'Team selected',
      color: 'success'
    })
  }


  async function checkSlug(slug: string) {
    const { error } = await client.organization.checkSlug({
      slug
    })
    if (error?.code === 'SLUG_IS_TAKEN') {
      toast.add({
        title: 'Slug is taken',
        color: 'error'
      })
      return false
    }
    return true
  }

  async function createTeam(event: FormSubmitEvent<CreateTeamSchema>) {
    const isSlugAvailable = await checkSlug(event.data.slug)
    if (!isSlugAvailable) return
    const { data, error } = await client.organization.create({
      name: event.data.name,
      slug: event.data.slug,
      logo: event.data.logo
    })
    console.log('createdTeam', data, error)
    if (error) {
      toast.add({
        title: 'Failed to create team',
        color: 'error'
      })
      return
    }
    toast.add({
      title: 'Team created',
      color: 'success'
    })
    refresh()
  }

  async function deleteTeam(id: string) {
    const { data, error } = await client.organization.delete({
      organizationId: id
    })
    console.log('deletedTeam', data, error)
    if (error) {
      toast.add({
        title: 'Failed to delete team',
        color: 'error'
      })
    }
    toast.add({
      title: 'Team deleted',
      color: 'success'
    })
    refresh()
  }

  return {
    organization,
    getFullOrganization,
    selectTeam,
    createTeam,
    deleteTeam,
    organizations,
    isLoading
  }
}
