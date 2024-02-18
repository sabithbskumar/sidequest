<script setup lang="ts">
import type { TransactionFormData } from "@/components/Forms";
import { TransactionForm } from "@/components/Forms";
import GlassModal from "@/components/GlassModal.vue";
import { useCurrencyStore } from "@/stores/currency";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import AddIcon from "~icons/material-symbols-light/add-rounded";
import TransactionItem from "@/components/Currency/TransactionItem.vue";
import TallyItem from "@/components/Currency/TallyItem.vue";
import TheHeader from "@/components/TheHeader.vue";

const currencyStore = useCurrencyStore();
const { transactionIds, transactionRecords } = storeToRefs(currencyStore);
const { addTransaction, updateTransaction, deleteTransaction, loadData } = currencyStore;

const storedData = localStorage.getItem("currencyStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(currencyStore, () => {
  const stringifiedStore = JSON.stringify(currencyStore.$state);
  localStorage.setItem("currencyStore", stringifiedStore);
});

const isModalVisible = ref(false);
function openModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
  editedTransactionId.value = null;
}

const editedTransactionId = ref<null | string>(null);

function getFormData() {
  if (editedTransactionId.value)
    return {
      id: editedTransactionId.value,
      transaction: {
        ...transactionRecords.value[editedTransactionId.value],
      },
    };
  else return { id: "", transaction: { amount: "", type: "expense", note: "" } };
}
function getFormOptions() {
  if (editedTransactionId.value) return { heading: "Edit Transaction", primaryLabel: "Edit" };
  else return { heading: "Add Transaction", primaryLabel: "Add" };
}
const handleEdit = (id: string) => {
  editedTransactionId.value = id;
  openModal();
};

const handleSubmit = (formData: TransactionFormData) => {
  if (formData.id === "") {
    const id = Date.now().toString();
    addTransaction({ id, transaction: formData.transaction });
  } else {
    updateTransaction({ id: formData.id, transaction: formData.transaction });
  }
  editedTransactionId.value = null;
};

const handleDelete = (id: string) => {
  deleteTransaction({ id });
};

const handleClick = (id: string) => {
  if (activeTransactionId.value === id) activeTransactionId.value = "";
  else activeTransactionId.value = id;
};

const activeTransactionId = ref("");

function tallyFinances() {
  return transactionIds.value.reduce(
    (previous, transactionId) => {
      const record = transactionRecords.value[transactionId];
      const next = { ...previous };
      switch (record.type) {
        case "income":
          next.income = previous.income + parseFloat(record.amount);
          next.balance = previous.balance + parseFloat(record.amount);
          break;
        case "expense":
          next.expense = previous.expense + parseFloat(record.amount);
          next.balance = previous.balance - parseFloat(record.amount);
          break;
      }

      return next;
    },
    { income: 0, expense: 0, balance: 0 },
  );
}
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Currency" />

    <div class="grow bg-neutral-800 overflow-y-auto pt-2 pb-20 pl-2 [scrollbar-gutter:stable]">
      <div class="w-full flex flex-col gap-2">
        <TransitionGroup name="list">
          <TransactionItem
            v-for="transactionId in transactionIds"
            :key="transactionId"
            :transaction-id="transactionId"
            :amount="transactionRecords[transactionId].amount"
            :type="transactionRecords[transactionId].type"
            :note="transactionRecords[transactionId].note"
            :active-transaction-id="activeTransactionId"
            :show-actions="activeTransactionId === transactionId"
            @edit="handleEdit"
            @delete="handleDelete"
            @click="handleClick"
          />
        </TransitionGroup>
      </div>
    </div>
    <div
      class="absolute pointer-events-none bottom-0 left-0 right-0 p-3 h-20 flex gap-2 justify-between"
    >
      <div
        class="grow h-full max-w-sm bg-neutral-700/50 rounded-2xl grid grid-cols-3 items-center divide-x divide-neutral-700/40 backdrop-blur pointer-events-auto"
      >
        <TallyItem v-for="(value, type) in tallyFinances()" :key="type" :type :value />
      </div>

      <button
        class="size-14 rounded-2xl bg-green-500 shrink-0 pointer-events-auto"
        @click="openModal"
      >
        <AddIcon class="size-full p-2" />
      </button>
    </div>

    <GlassModal :is-visble="isModalVisible" @close="closeModal">
      <TransactionForm
        :form-data="getFormData()"
        :form-options="getFormOptions()"
        @cancel="closeModal"
        @submit="handleSubmit"
      />
    </GlassModal>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
  user-select: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
  right: 0;
  width: 100%;
}
</style>
