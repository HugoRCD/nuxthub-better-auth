<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'

definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})

const auth = useAuth()
const toast = useToast()

const items = ref<TabsItem[]>([
  {
    label: 'Sign in',
    slot: 'signin'
  },
  {
    label: 'Sign up',
    slot: 'signup'
  }
])

const signInFields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }, {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
    required: true
  }
]

const signUpFields = [
  ...signInFields,
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true
  }
]

const providers = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      auth.signIn.social({ provider: 'github', callbackURL: '/user' })
    }
  }
]

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

const signUpSchema = z.object({
  ...signInSchema.shape,
  name: z.string().min(1, 'Name is required')
})

type SignInSchema = z.output<typeof signInSchema>
type SignUpSchema = z.output<typeof signUpSchema>

async function onSignIn(payload: FormSubmitEvent<SignInSchema>) {
  try {
    const { data, error } = await auth.signIn.email({
      email: payload.data.email,
      password: payload.data.password,
    })
    if (data) {
      toast.add({
        title: 'Successfully signed in',
        color: 'success',
      })
      await navigateTo('/user')
    } else {
      toast.add({
        title: error.message,
        color: 'error',
      })
    }
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'error',
    })
  }
}

async function onSignUp(payload: FormSubmitEvent<SignUpSchema>) {
  try {
    const { data, error } = await auth.signUp.email({
      email: payload.data.email,
      password: payload.data.password,
      name: payload.data.name,
    })
    if (data) {
      toast.add({
        title: 'Successfully signed up',
        color: 'success',
      })
      await navigateTo('/user')
    } else {
      toast.add({
        title: error.message,
        color: 'error',
      })
    }
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'error',
    })
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="relative w-full max-w-md bg-muted/20">
      <span class="cross absolute -bottom-px -left-px size-px" />
      <span class="cross absolute -bottom-px -right-px size-px" />
      <span class="cross absolute -left-px -top-px size-px" />
      <span class="cross absolute -right-px -top-px size-px" />
      <UTabs :items variant="link" :ui="{ list: 'mb-4'}">
        <template #signin>
          <UAuthForm
            :schema="signInSchema"
            title="Login"
            description="Enter your credentials to access your account."
            :fields="signInFields"
            :providers
            :ui="{
              title: 'text-left',
              description: 'text-left'
            }"
            @submit="onSignIn"
          />
        </template>
        <template #signup>
          <UAuthForm
            :schema="signUpSchema"
            title="Sign up"
            description="Create an account to access your account."
            :fields="signUpFields"
            :providers
            :ui="{
              title: 'text-left',
              description: 'text-left'
            }"
            @submit="onSignUp"
          />
        </template>
      </UTabs>
    </UPageCard>
  </div>
</template>
