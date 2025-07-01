<script setup lang="ts">
useSeoMeta({
  title: 'Nuxt x BetterAuth',
  description: 'Nuxt x BetterAuth - Demo of using BetterAuth with Nuxt',
  ogImage: 'https://better-auth.hrcd.fr/og.png',
  twitterImage: 'https://better-auth.hrcd.fr/og.png',
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
