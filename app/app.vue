<script setup lang="ts">
useSeoMeta({
  title: 'Nuxt x BetterAuth',
  description: 'Nuxt x BetterAuth - Demo of using BetterAuth with Nuxt',
  ogImage: '/og.png',
  twitterImage: '/og.png',
})
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
