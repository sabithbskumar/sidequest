<script setup lang="ts">
import { ref } from "vue";
import type { TransactionCategoryFormData } from ".";

const props = defineProps<{
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  formData: TransactionCategoryFormData;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [TransactionCategoryFormData];
}>();

const formValues = ref(props.formData);

function handleSubmit() {
  emit("submit", formValues.value);
  handleCancel();
}

function handleCancel() {
  emit("cancel");
}

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};
</script>

<template>
  <h2 class="text-center pt-2 pb-6 text-2xl">{{ formOptions.heading }}</h2>
  <form
    autoComplete="off"
    class="m-auto px-4 w-full grow flex flex-col justify-between"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-4">
      <div class="flex">
        <label>
          <input v-model="formValues.category.type" type="radio" name="type" value="expense" />
          <span class="p-2">Expense</span>
        </label>
        <br />
        <label>
          <input v-model="formValues.category.type" type="radio" name="type" value="income" />
          <span class="p-2">Income</span>
        </label>
      </div>
      <div class="flex flex-col gap-2">
        <input
          v-model="formValues.category.name"
          v-focus
          type="text"
          class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
          placeholder="Category name"
          name="name"
          required
        />
        <input
          v-model="formValues.category.symbol"
          v-focus
          type="text"
          class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
          placeholder="Symbol"
          maxlength="20"
          name="symbol"
          required
        />
      </div>
    </div>
    <div class="flex gap-4">
      <input
        type="button"
        value="Cancel"
        class="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
        @click="handleCancel"
      />
      <input
        type="submit"
        :value="formOptions.primaryLabel"
        class="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
      />
    </div>
  </form>
</template>

<style scoped></style>
