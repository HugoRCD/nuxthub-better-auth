<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { data: notes, refresh } = await useFetch('/api/notes')
const { user } = useAuth()
const toast = useToast()

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  content: undefined
})

const deleteNote = async (id: number) => {
  await $fetch(`/api/notes/${id}`, {
    method: 'DELETE'
  })
  toast.add({
    icon: 'i-lucide-trash',
    title: 'Note deleted',
    color: 'success'
  })
  refresh()
}

async function createNote(event: FormSubmitEvent<Schema>) {
  await $fetch('/api/notes', {
    method: 'POST',
    body: {
      ...state,
      userId: user.value?.id
    }
  })
  toast.add({
    icon: 'i-lucide-plus',
    title: 'Note created',
    color: 'success'
  })
  refresh()
  state.title = undefined
  state.content = undefined
}
</script>

<template>
  <div>
    <UCard>
      <UForm :schema :state class="flex flex-col gap-2" @submit="createNote">
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" />
        </UFormField>
        <UFormField label="Content" name="content" required>
          <UInput v-model="state.content" />
        </UFormField>
        <UButton type="submit" label="Create Note" block class="mt-4" />
      </UForm>
    </UCard>
    <div class="flex flex-col gap-2 mt-4">
      <UCard v-for="note in notes" :key="note.id">
        <div class="flex items-center gap-1">
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-bold">
              {{ note.title }}
            </h2>
            <p>{{ note.content }}</p>
          </div>
          <UButton color="error" icon="i-lucide-trash" class="ml-auto" @click="deleteNote(note.id)" />
        </div>
      </UCard>
    </div>
  </div>
</template>
