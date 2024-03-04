<script setup lang="ts">
defineProps<{
  data: {
    heading: string;
  };
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <div class="size-full max-h-64">
    <div
      class="h-full max-h-64 aspect-[6/9] overflow-hidden mx-auto rounded-s rounded-e-xl bg-green-600 border-green-500 border-l-8 px-3 py-4 cursor-pointer"
      @click="$emit('click')"
    >
      <span class="truncate-lines" v-text="data.heading"></span>
    </div>
  </div>
</template>

<style scoped>
.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: var(--truncate-lines, 5);
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: normal;
  overflow-wrap: anywhere;
}
</style>
