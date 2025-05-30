<script setup lang="ts">
useSeoMeta({
  title: 'NuxtHub x BetterAuth',
  description: 'NuxtHub x BetterAuth - Demo of using BetterAuth with NuxtHub',
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
