<script setup lang="ts">
const links = [
  {
    label: 'Source Code',
    to: 'https://github.com/HugoRCD/nuxt-better-auth',
    target: '_blank',
  },
  {
    label: 'Better Auth',
    to: 'https://better-auth.com',
    target: '_blank',
  },
  {
    label: 'Nuxt',
    to: 'https://nuxt.com',
    target: '_blank',
  },
  {
    label: 'Vercel',
    to: 'https://vercel.com',
    target: '_blank',
  }
]
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" class="h-px" />
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>
    
    <UNavigationMenu :items="links" />

    <template #right>
      <UButton
        icon="i-simple-icons-x"
        color="neutral"
        variant="ghost"
        to="https://x.com/hugorcd__"
        target="_blank"
        aria-label="X"
      />
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/HugoRCD/nuxt-better-auth"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
