<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const { client } = useAuth()

const schema = z.object({
  name: z.string().min(1, 'Team name is required'),
  slug: z.string().min(1, 'Team slug is required'),
  logo: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  slug: undefined,
  logo: undefined
})

const { data: organizations, refresh } = await useAsyncData('organizations', async () => {
  const { data, error } = await client.organization.list()
  if (error) {
    toast.add({
      title: 'Failed to fetch organizations',
      color: 'error'
    })
  }
  return data
})

async function checkSlug(slug: string) {
  const { data, error } = await client.organization.checkSlug({
    slug
  })
  console.log('checkSlug', data, error)
  if (error?.code === 'SLUG_IS_TAKEN') {
    toast.add({
      title: 'Slug is taken',
      color: 'error'
    })
    return false
  }
  return true
}

async function createTeam(event: FormSubmitEvent<Schema>) {
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
  state.name = undefined
  state.slug = undefined
  state.logo = undefined
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
</script>

<template>
  <div>
    <UCard>
      <UForm :schema :state class="flex flex-col gap-2" @submit="createTeam">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Slug" name="slug" required>
          <UInput v-model="state.slug" />
        </UFormField>
        <UFormField label="Logo" name="logo">
          <UInput v-model="state.logo" />
        </UFormField>
        <UButton type="submit" label="Create Team" block class="mt-4" />
      </UForm>
    </UCard>
    <div class="flex flex-col gap-2 mt-4">
      <UCard v-for="team in organizations" :key="team.id">
        <div class="flex items-center gap-1">
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-bold">
              {{ team.name }}
            </h2>
          </div>
          <UButton color="error" icon="i-lucide-trash" class="ml-auto" @click="deleteTeam(team.id)" />
        </div>
      </UCard>
    </div>
  </div>
</template>
