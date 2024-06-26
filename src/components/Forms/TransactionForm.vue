<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { TransactionFormData } from ".";
import { useCurrencyStore } from "@/stores/currency";
import { storeToRefs } from "pinia";

const props = defineProps<{
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  formData: TransactionFormData;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [TransactionFormData];
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

const currencyStore = useCurrencyStore();
const { categoryIds, categoryRecords } = storeToRefs(currencyStore);
const { loadData } = currencyStore;

const storedData = localStorage.getItem("currencyStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(currencyStore, () => {
  const stringifiedStore = JSON.stringify(currencyStore.$state);
  localStorage.setItem("currencyStore", stringifiedStore);
});

const filteredCategoryIds = computed(() =>
  categoryIds.value.filter(
    (id) => categoryRecords.value[id].type === formValues.value.transaction.type,
  ),
);
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
          <input v-model="formValues.transaction.type" type="radio" name="type" value="expense" />
          <span class="p-2">Expense</span>
        </label>
        <br />
        <label>
          <input v-model="formValues.transaction.type" type="radio" name="type" value="income" />
          <span class="p-2">Income</span>
        </label>
      </div>
      <div class="flex flex-col gap-2">
        <input
          v-model="formValues.transaction.amount"
          v-focus
          type="text"
          class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
          placeholder="Amount"
          name="amount"
          maxlength="8"
          step="any"
          inputmode="decimal"
          pattern="^\d+(\.\d{1,2})?$"
          title="Enter a valid number"
          required
        />
        <input
          v-model.trim="formValues.transaction.note"
          type="text"
          class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
          placeholder="Note"
          name="note"
        />
        <select
          v-model="formValues.transaction.categoryId"
          name="categoryId"
          class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
          required
        >
          <option value="" disabled>Category</option>
          <option
            v-for="categoryId in filteredCategoryIds"
            :key="categoryId"
            :value="categoryId"
            v-text="categoryRecords[categoryId].name"
          ></option>
        </select>
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
