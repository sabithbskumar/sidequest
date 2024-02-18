<script setup lang="ts">
defineProps<{ isVisble: boolean }>();
defineEmits<{
  close: [];
}>();
</script>

<template>
  <div
    v-if="isVisble"
    class="bg-neutral-900/50 absolute flex inset-0 backdrop-blur-sm shadow-md"
    @click.self="$emit('close')"
  >
    <div class="grow max-w-2xl max-h-full mx-auto p-5">
      <div class="w-full h-full bg-neutral-500/50 py-4 rounded-lg flex flex-col">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>
