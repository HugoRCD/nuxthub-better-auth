<script setup lang="ts">
// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client } = useAuth()
const toast = useToast()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some(account => account.provider === provider)
}

const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    toast.add({
      color: 'error',
      title: error as string,
    })
  }
})
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <UPageCard class="flex flex-col items-center p-6">
      <UAvatar
        v-if="user?.image"
        :src="user.image"
        alt="User avatar"
        class="rounded-full mx-auto size-20"
      />
      <div class="text-center">
        <div class="text-xl font-semibold">
          {{ user?.name }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ user?.email }}
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-2">
          <UBadge v-if="user?.emailVerified" color="success" variant="soft">
            Email verified
          </UBadge>
          <UBadge v-else color="warning" variant="soft">
            Email not verified
          </UBadge>
        </div>
      </div>
      <div class="mt-4 w-full">
        <ul class="text-sm text-muted-foreground space-y-1">
          <li><span class="font-medium">ID:</span> {{ user?.id }}</li>
          <li><span class="font-medium">Created at:</span> {{ user?.createdAt }}</li>
          <li v-if="user?.updatedAt">
            <span class="font-medium">Updated at:</span> {{ user.updatedAt }}
          </li>
        </ul>
      </div>
    </UPageCard>

    <UPageCard class="p-6">
      <div class="text-lg font-semibold mb-2">
        Session
      </div>
      <ul class="text-sm text-muted-foreground space-y-1">
        <li><span class="font-medium">IP address:</span> {{ session?.ipAddress }}</li>
        <li><span class="font-medium">User Agent:</span> <span class="break-all">{{ session?.userAgent }}</span></li>
        <li><span class="font-medium">Expires at:</span> {{ session?.expiresAt }}</li>
        <li><span class="font-medium">Token:</span> <span class="break-all">{{ session?.token }}</span></li>
      </ul>
    </UPageCard>
  </div>

  <UPageCard class="p-6">
    <div class="text-lg font-semibold mb-2">
      Linked Accounts
    </div>
    <div>
      <UButton
        v-if="hasProvider('github')"
        color="neutral"
        icon="i-simple-icons-github"
        trailing-icon="i-heroicons-check"
        label="Linked with GitHub"
      />
      <UButton
        v-else
        color="neutral"
        icon="i-simple-icons-github"
        label="Link with GitHub"
        @click="client.linkSocial({ provider: 'github' })"
      />
    </div>
  </UPageCard>
</template>
