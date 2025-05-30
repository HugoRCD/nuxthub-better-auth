<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { CreateTeamModal } from '#components'

defineProps<{
  collapsed?: boolean
}>()

const {
  isLoading,
  organization,
  organizations,
  selectTeam,
  createTeam,
  deleteTeam
} = useOrgs()

const overlay = useOverlay()

const modal = overlay.create(CreateTeamModal)

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    organizations.value?.map(team => ({
      label: team.name,
      avatar: {
        src: team.logo || '',
        alt: team.name || ''
      },
      onSelect() {
        selectTeam(team.id)
      }
    })), [
      {
        label: 'Create team',
        icon: 'i-lucide-circle-plus',
        onSelect: () => {
          modal.open()
        }
      }, {
        label: 'Manage teams',
        icon: 'i-lucide-cog'
      }
    ]
  ]
})
</script>

<template>
  <UDropdownMenu
    :items
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      :loading="isLoading"
      v-bind="{
        avatar: {
          src: organization?.logo || '',
          alt: organization?.name || ''
        },
        label: collapsed ? undefined : organization?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
