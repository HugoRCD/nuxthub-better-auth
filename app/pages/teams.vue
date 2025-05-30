<script setup lang="ts">
const {
  isLoading,
  organizations,
  selectTeam,
  deleteTeam
} = useOrgs()
</script>

<template>
  <div>
    <div v-if="!isLoading" class="flex flex-col gap-2 mt-4">
      <UCard v-for="team in organizations" :key="team.id">
        <div class="flex items-center gap-1">
          <div class="flex flex-col gap-1 flex-1">
            <h2 class="text-lg font-bold">
              {{ team.name }}
            </h2>
            <UAvatarGroup>
              <UAvatar v-for="member in team.members" :key="member.id" :src="member.user.image" :alt="member.user.name" />
            </UAvatarGroup>
          </div>
          <div class="flex items-center gap-1">
            <UButton color="primary" icon="i-lucide-mouse-pointer-2" class="ml-auto" @click="selectTeam(team.id)" />
            <UButton color="error" icon="i-lucide-trash" class="ml-auto" @click="deleteTeam(team.id)" />
          </div>
        </div>
      </UCard>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <UCard v-for="i in 3" :key="i">
        <USkeleton class="w-full h-10" />
      </UCard>
    </div>
  </div>
</template>
