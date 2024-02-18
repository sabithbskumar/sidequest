<script setup lang="ts">
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";
import CheckedIcon from "~icons/material-symbols-light/check-box-rounded";
import UncheckedIcon from "~icons/material-symbols-light/check-box-outline-blank";

defineProps<{
  questId: string;
  title: string;
  isCompleted: boolean;
  showActions: boolean;
}>();

defineEmits<{
  edit: [questId: string];
  delete: [questId: string];
  click: [questId: string];
  toggle: [questId: string];
}>();
</script>

<template>
  <div class="flex justify-between mx-auto w-full max-w-5xl h-14 overflow-clip">
    <div
      class="grow h-full inline-flex items-center overflow-hidden rounded bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm"
      @click.self="$emit('click', questId)"
    >
      <button
        class="outline-none size-14 shrink-0 focus-visible:ring-inset focus-visible:ring rounded"
        :class="[isCompleted ? 'text-green-400' : 'text-neutral-400']"
        @click="$emit('toggle', questId)"
      >
        <CheckedIcon v-if="isCompleted" class="size-full p-4" />
        <UncheckedIcon v-else class="size-full p-4" />
      </button>

      <span class="truncate pointer-events-none pr-3 text-neutral-100 font-medium">{{
        title
      }}</span>

      <Transition name="action-buttons">
        <div v-if="showActions" class="ml-auto h-full inline-flex">
          <button
            type="button"
            class="outline-none text-neutral-400 hover:text-white focus-visible:ring-inset focus-visible:ring rounded"
            @click="$emit('edit', questId)"
          >
            <EditIcon class="size-14 p-3 shrink-0" />
          </button>
          <button
            class="outline-none text-neutral-400 hover:text-red-400 focus-visible:ring-inset focus-visible:ring rounded"
            type="button"
            @click="$emit('delete', questId)"
          >
            <DeleteIcon class="size-14 p-3 shrink-0" />
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.action-buttons-enter-active,
.action-buttons-leave-active {
  transition: all 0.2s ease;
}

.action-buttons-enter-from,
.action-buttons-leave-to {
  transform: translateX(100%);
}
</style>
