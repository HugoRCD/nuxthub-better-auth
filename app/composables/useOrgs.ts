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

  const organizations = useState<FullOrganization[]>('organizations', () => [])
  const isLoading = useState('orgs-loading', () => false)
  const hasOrganizations = computed(() => organizations.value && organizations.value.length > 0)

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

  async function fetchOrganizations() {
    if (isLoading.value) return organizations.value
    
    isLoading.value = true
    try {
      const { data, error } = await client.organization.list()

      if (error) {
        console.log('error', error)
        toast.add({
          title: 'Failed to fetch organizations',
          color: 'error'
        })
        return organizations.value
      }
      
      const fullOrgs = await Promise.all(
          data!.map((org) => getFullOrganization(org.id))
      ) as FullOrganization[]
      
      organizations.value = fullOrgs
      
      if (!activeOrganizationId.value && fullOrgs.length > 0) {
        const [firstOrg] = fullOrgs
        if (firstOrg) {
          activeOrganizationId.value = firstOrg.id
          console.log(`Auto-selecting first organization: ${firstOrg.name}`)
        }
      }
      
      return fullOrgs
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentOrganization() {
    if (!activeOrganizationId.value) return null
    organization.value = await getFullOrganization(activeOrganizationId.value)
    return organization.value
  }

  async function selectTeam(id: string, options: { showToast?: boolean } = {}) {
    const { showToast = true } = options
    const { data, error } = await client.organization.setActive({
      organizationId: id
    })
    console.log('selectedTeam', data, error)
    activeOrganizationId.value = id
    await fetchCurrentOrganization()
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
    
    await fetchOrganizations()
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
    await fetchOrganizations()
  }

  return {
    organization,
    organizations,
    isLoading,
    hasOrganizations,
    fetchOrganizations,
    fetchCurrentOrganization,
    getFullOrganization,
    selectTeam,
    createTeam,
    deleteTeam
  }
}
