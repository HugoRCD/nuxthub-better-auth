<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { user } = useAuth()
const { createTeam, isLoading } = useOrgs()
const toast = useToast()

const schema = z.object({
  name: z.string().min(1, 'Team name is required'),
  slug: z.string().min(1, 'Team slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  slug: undefined
})

watch(() => state.name, (newName) => {
  if (newName && !state.slug) {
    state.slug = newName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

onMounted(() => {
  if (user.value?.name && !state.name) {
    state.name = `${user.value.name}'s Team`
  }
})

async function onCreateTeam(event: FormSubmitEvent<Schema>) {
  try {
    const success = await createTeam(event, { showToast: false })
    if (!success) return
    toast.add({
      title: 'Welcome! Your team has been created.',
      description: 'You can now start using the application.',
      color: 'success'
    })
    await new Promise(resolve => setTimeout(resolve, 150))
    await navigateTo('/app/user')
  } catch (error: any) {
    toast.add({
      title: 'Failed to create team',
      description: error.message,
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="relative w-full max-w-md bg-muted/20" :ui="{ header: 'w-full' }">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Welcome to the app!
          </h1>
          <p class="text-muted-foreground mt-2">
            Let's create your first team to get started.
          </p>
        </div>
      </template>

      <UForm 
        :schema 
        :state 
        class="flex flex-col gap-4" 
        @submit="onCreateTeam"
      >
        <UFormField label="Team Name" name="name" required>
          <UInput 
            v-model="state.name" 
            placeholder="e.g. My Awesome Team"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField label="Team Slug" name="slug" required>
          <UInput 
            v-model="state.slug" 
            placeholder="e.g. my-awesome-team"
            :disabled="isLoading"
          />
          <template #help>
            This will be used in URLs and must be unique.
          </template>
        </UFormField>

        <UButton 
          type="submit" 
          label="Create Team" 
          block 
          size="lg"
          :loading="isLoading"
          class="mt-4"
        />
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-muted-foreground">
          You can create additional teams later from the teams menu.
        </div>
      </template>
    </UPageCard>
  </div>
</template> 
