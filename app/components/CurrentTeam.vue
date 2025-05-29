<script setup lang="ts">
const organization = useCurrentOrganization()
</script>

<template>
  <div class="flex items-center gap-1">
    <span class="font-bold"> Selected Team: </span>
    <span>
      {{ organization?.name }}
    </span>
    /
    <span>
      {{ organization?.slug }}
    </span>
  </div>
</template>

<style scoped>

</style>
