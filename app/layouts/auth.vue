<template>
  <div class="min-h-screen flex flex-col relative">
    <div class="absolute top-2 left-2 flex items-center justify-center gap-2">
      <UIcon name="i-simple-icons-nuxtdotjs" class="size-8" />
      <NuxtLink to="/" class="flex items-center gap-3">
        <span class="text-sm font-bold">Nuxt x BetterAuth</span>
      </NuxtLink>
    </div>
    <slot />
    <Footer />
  </div>
</template>
