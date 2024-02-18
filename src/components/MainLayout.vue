<script setup lang="ts">
import { provide, ref } from "vue";
import { sidebarInjectionKey } from "@/injectionKeys";

const isSidebarExpanded = ref(false);
const toggleSidebar = () => (isSidebarExpanded.value = !isSidebarExpanded.value);
provide(sidebarInjectionKey, { isExpanded: isSidebarExpanded, toggle: toggleSidebar });
</script>

<template>
  <div class="bg-neutral-900 text-neutral-100 h-full w-full overflow-clip">
    <div class="w-full h-full flex overflow-clip">
      <div
        :class="[
          'w-full',
          'shrink-0',
          isSidebarExpanded ? 'max-w-full md:max-w-xs xl:max-w-sm' : 'max-w-16',
          'whitespace-nowrap',
          'transition-[max-width]',
          'duration-200',
        ]"
      >
        <slot name="sidebar" />
      </div>
      <div class="grow overflow-hidden border-l border-neutral-700/70">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
