<script setup lang="ts">
useSeoMeta({
  title: 'Nuxt x BetterAuth',
  description: 'Nuxt x BetterAuth - Demo of using BetterAuth with Nuxt',
  ogImage: 'https://better-auth.hrcd.fr/og.png',
  ogUrl: 'https://better-auth.hrcd.fr',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://better-auth.hrcd.fr/og.png',
  twitterTitle: 'Nuxt x BetterAuth',
  twitterDescription: 'Nuxt x BetterAuth - Demo of using BetterAuth with Nuxt',
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
