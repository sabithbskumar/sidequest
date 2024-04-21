<script setup lang="ts">
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";
import type { TransactionCategory } from "@/stores/currency";

defineProps<{
  transactionId: string;
  amount: string;
  type: string;
  note: string;
  category: TransactionCategory;
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
  <div class="flex gap-2 justify-between mx-auto w-full max-w-5xl h-14 overflow-clip">
    <div
      class="grow h-full inline-flex items-center gap-2 overflow-hidden rounded bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm px-2"
      @click.self="$emit('click', transactionId)"
    >
      <span
        class="size-10 shrink-0 truncate inline-flex items-center justify-center rounded-sm pointer-events-none text-neutral-100 font-bold shadow"
        :class="type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'"
        v-text="category.symbol || category.name[0]"
      ></span>
      <span class="truncate pointer-events-none text-neutral-200 font-medium">{{ note }}</span>
      <span
        class="px-2 font-semibold shrink-0 font-mono before:px-1 pointer-events-none ml-auto"
        :class="transactionStyle(type)"
      >
        {{ parseFloat(amount).toFixed(2) }}
      </span>
    </div>
    <div v-if="showActions" class="ml-auto h-full inline-flex rounded bg-neutral-600 bg-opacity-20">
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
  </div>
</template>
