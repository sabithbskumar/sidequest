<script setup lang="ts">
import { sidebarInjectionKey } from "@/injectionKeys";
import { inject, type FunctionalComponent } from "vue";
import Logo from "~icons/fluent-emoji/scroll";
import type { SidebarInjectI } from ".";
import { SidebarToggle } from ".";

defineProps<{
  links: Link[];
}>();

interface Link {
  label: string;
  name: string;
  icon: FunctionalComponent;
}
const { isExpanded } = inject(sidebarInjectionKey) as SidebarInjectI;
</script>

<template>
  <div class="w-full h-full bg-neutral-700/50 flex flex-col">
    <div class="h-16 flex items-center">
      <RouterLink :to="{ name: 'dashboard' }" class="size-16 p-2 shrink-0">
        <Logo class="size-full border border-neutral-700/50 hover:bg-neutral-600 p-2 rounded-lg" />
      </RouterLink>
      <Transition>
        <div v-show="isExpanded" class="grow max-w-full px-2">
          <span class="text-2xl">SideQuest</span>
        </div>
      </Transition>
    </div>
    <div class="grow p-3 border-t border-neutral-700/50 flex flex-col justify-between">
      <div class="h-full flex flex-col gap-2">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="h-10 flex items-center shrink-0 rounded-lg hover:bg-neutral-600"
          active-class="bg-neutral-600"
        >
          <component :is="link.icon" class="size-10 p-2 shrink-0" />
          <Transition>
            <div v-show="isExpanded" class="grow max-w-full px-2">
              <span>
                {{ link.label }}
              </span>
            </div>
          </Transition>
        </RouterLink>
      </div>
      <div class="size-10 rounded-lg bg-neutral-700/10 hover:bg-neutral-600">
        <SidebarToggle />
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: max-width 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  max-width: 0;
}
</style>
