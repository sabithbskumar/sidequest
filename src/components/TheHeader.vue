<script setup lang="ts">
defineProps<{
  heading: string;
}>();
</script>

<template>
  <div class="flex items-center bg-neutral-700/50 shadow-lg z-10 h-full max-h-16 shrink-0">
    <slot name="before"></slot>
    <div class="grow px-3">
      <span class="text-xl font-semibold">{{ heading }}</span>
    </div>
    <slot name="default"></slot>
  </div>
</template>
