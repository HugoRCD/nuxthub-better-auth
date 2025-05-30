<template>
  <div class="min-h-screen flex flex-col relative">
    <div class="absolute top-2 left-2 flex items-center justify-center gap-2">
      <UIcon name="i-simple-icons-nuxtdotjs" class="size-8" />
      <span class="text-sm font-bold">NuxtHub x BetterAuth</span>
    </div>
    <slot />
    <Footer />
  </div>
</template>
