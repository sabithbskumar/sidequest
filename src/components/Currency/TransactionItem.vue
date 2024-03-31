<script setup lang="ts">
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";

defineProps<{
  transactionId: string;
  amount: string;
  type: string;
  note: string;
  category: string;
  showActions: boolean;
}>();

defineEmits<{
  edit: [transactionId: string];
  delete: [transactionId: string];
  click: [transactionId: string];
}>();

const transactionStyle = (type: string) => {
  switch (type) {
    case "income": {
      return "text-green-500 before:content-['+']";
    }
    case "expense": {
      return "text-red-400 before:content-['-']";
    }
  }
};
</script>

<template>
  <div class="flex justify-between mx-auto w-full max-w-5xl h-14 overflow-clip">
    <div
      class="grow h-full inline-flex items-center gap-2 overflow-hidden rounded bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm"
      @click.self="$emit('click', transactionId)"
    >
      <span
        class="px-2 font-semibold shrink-0 font-mono before:px-1 min-w-[12ch] border-r border-neutral-600 pointer-events-none"
        :class="transactionStyle(type)"
      >
        {{ amount }}
      </span>
      <span class="px-3 truncate pointer-events-none text-neutral-200 font-medium">{{
        category
      }}</span>
      <span class="px-3 truncate pointer-events-none text-neutral-200 font-medium">{{ note }}</span>

      <Transition name="action-buttons">
        <div v-if="showActions" class="ml-auto h-full inline-flex">
          <button
            type="button"
            class="outline-none text-neutral-400 hover:text-white focus-visible:ring-inset focus-visible:ring rounded"
            @click="$emit('edit', transactionId)"
          >
            <EditIcon class="size-14 p-3 shrink-0" />
          </button>
          <button
            class="outline-none text-neutral-400 hover:text-red-400 focus-visible:ring-inset focus-visible:ring rounded"
            type="button"
            @click="$emit('delete', transactionId)"
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
