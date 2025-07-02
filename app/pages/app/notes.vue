<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

type NoteWithUser = {
  id: number
  title: string
  content: string
  done: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

const { data: notes, refresh } = await useFetch<NoteWithUser[]>('/api/notes')
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
      title: event.data.title,
      content: event.data.content
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">
          Create a new note
        </h2>
      </template>
      
      <UForm :schema :state class="flex flex-col gap-4" @submit="createNote">
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" placeholder="Enter a title for your note" />
        </UFormField>
        <UFormField label="Content" name="content" required class="w-full">
          <UTextarea v-model="state.content" placeholder="Write your note content here..." :rows="3" class="w-full" />
        </UFormField>
        <UButton type="submit" label="Create Note" icon="i-lucide-plus" class="mt-2" />
      </UForm>
    </UCard>

    <div class="mt-6 space-y-4">
      <h2 class="text-xl font-semibold">
        Notes
      </h2>
      
      <div v-if="!notes || notes.length === 0" class="text-center py-12 text-muted-foreground">
        <UIcon name="i-lucide-notebook-pen" class="size-12 mx-auto mb-4 opacity-50" />
        <p>No notes yet. Create your first note above!</p>
      </div>

      <UCard v-for="note in notes" :key="note.id" class="transition-all hover:shadow-md">
        <template #footer>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="note.user.image"
                :alt="note.user.name"
                size="sm"
              />
              <div class="flex flex-col">
                <span class="font-medium text-sm">{{ note.user.name }}</span>
                <span class="text-xs text-muted-foreground">{{ formatDate(note.createdAt) }}</span>
              </div>
            </div>
            <UButton 
              color="error" 
              variant="ghost" 
              icon="i-lucide-trash-2" 
              size="sm"
              @click="deleteNote(note.id)" 
            />
          </div>
        </template>

        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-primary">
            {{ note.title }}
          </h3>
          <p class="text-muted-foreground leading-relaxed">
            {{ note.content }}
          </p>
          <div v-if="note.done" class="flex items-center gap-2 text-success text-sm">
            <UIcon name="i-lucide-check-circle" class="size-4" />
            <span>Completed</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
