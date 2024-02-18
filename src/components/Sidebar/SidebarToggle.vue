<script setup lang="ts">
import { sidebarInjectionKey } from "@/injectionKeys";
import { inject } from "vue";
import type { SidebarInjectI } from ".";
import ArrowIcon from "~icons/material-symbols-light/arrow-right-rounded";
const { toggle, isExpanded } = inject(sidebarInjectionKey) as SidebarInjectI;
</script>

<template>
  <button class="w-full h-full" @click="toggle">
    <ArrowIcon
      :class="['w-full h-full transition-transform duration-200', { 'rotate-180': isExpanded }]"
    />
  </button>
</template>
