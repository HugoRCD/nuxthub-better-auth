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

    if (error) {
      console.log('error', error)
      toast.add({
        title: 'Failed to fetch organizations',
        color: 'error'
      })
    }
    const fullOrgs = await Promise.all(
        data!.map((org) => getFullOrganization(org.id))
    ) as FullOrganization[]
    
    if (!activeOrganizationId.value && fullOrgs.length > 0) {
      const [firstOrg] = fullOrgs
      if (firstOrg) {
        activeOrganizationId.value = firstOrg.id
        console.log(`Auto-selecting first organization: ${firstOrg.name}`)
      }
    }
    
    return fullOrgs
  })

  const isLoading = computed(() => status.value === 'pending')
  const hasOrganizations = computed(() => organizations.value && organizations.value.length > 0)

  const { refresh: refreshSelectedTeam } = useAsyncData('selectedTeam', async () => {
    organization.value = await getFullOrganization()
    return organization.value
  })

  async function selectTeam(id: string, options: { showToast?: boolean } = {}) {
    const { showToast = true } = options
    const { data, error } = await client.organization.setActive({
      organizationId: id
    })
    console.log('selectedTeam', data, error)
    activeOrganizationId.value = id
    refreshSelectedTeam()
    if (showToast) {
      toast.add({
        title: 'Team selected',
        color: 'success'
      })
    }
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

  async function createTeam(event: FormSubmitEvent<CreateTeamSchema>, options: { showToast?: boolean } = {}) {
    const { showToast = true } = options
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
      return false
    }
    
    await refresh()
    if (data) {
      await selectTeam(data.id, { showToast: false })
    }
    
    if (showToast) {
      toast.add({
        title: 'Team created',
        color: 'success'
      })
    }
    return true
  }

  async function deleteTeam(id: string, options: { showToast?: boolean } = {}) {
    const { showToast = true } = options
    const { data, error } = await client.organization.delete({
      organizationId: id
    })
    if (error) {
      toast.add({
        title: 'Failed to delete team',
        color: 'error'
      })
    }
    if (showToast) {
      toast.add({
        title: 'Team deleted',
        color: 'success'
      })
    }
    refresh()
  }

  return {
    organization,
    getFullOrganization,
    selectTeam,
    createTeam,
    deleteTeam,
    organizations,
    isLoading,
    hasOrganizations
  }
}
