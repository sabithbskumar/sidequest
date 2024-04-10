<script setup lang="ts">
import type { TransactionFormData } from "@/components/Forms";
import { TransactionForm } from "@/components/Forms";
import GlassModal from "@/components/GlassModal.vue";
import { useCurrencyStore, type Transaction } from "@/stores/currency";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import AddIcon from "~icons/material-symbols-light/add-rounded";
import TransactionItem from "@/components/Currency/TransactionItem.vue";
import TallyItem from "@/components/Currency/TallyItem.vue";
import TheHeader from "@/components/TheHeader.vue";
import TagIcon from "~icons/fluent-emoji-flat/label";
import { RouterLink } from "vue-router";

const currencyStore = useCurrencyStore();
const { transactionIds, transactionRecords, categoryRecords } = storeToRefs(currencyStore);
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

function getFormData(): { id: string; transaction: Transaction } {
  if (editedTransactionId.value)
    return {
      id: editedTransactionId.value,
      transaction: {
        ...transactionRecords.value[editedTransactionId.value],
      },
    };
  else return { id: "", transaction: { amount: "", type: "expense", note: "", categoryId: "" } };
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

      const amount = parseFloat(record.amount);

      switch (record.type) {
        case "income": {
          if (transactionId >= filterStartTimestamp.value) next.income = previous.income + amount;
          if (transactionId <= filterEndTimestamp.value) next.balance = previous.balance + amount;
          break;
        }
        case "expense": {
          if (transactionId >= filterStartTimestamp.value) next.expense = previous.expense + amount;
          if (transactionId <= filterEndTimestamp.value) next.balance = previous.balance - amount;
          break;
        }
      }
      return next;
    },
    { income: 0, expense: 0, balance: 0 },
  );
}

const radioOptions = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Year",
    value: "year",
  },
];

const defaultFilter = "month";
const activeFilter = ref(defaultFilter);

const filterStartTimestamp = computed(() => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  switch (activeFilter.value) {
    case "day": {
      return currentDate.getTime().toString();
    }
    case "month": {
      currentDate.setDate(1);
      return currentDate.getTime().toString();
    }
    case "year": {
      currentDate.setMonth(0);
      currentDate.setDate(1);
      return currentDate.getTime().toString();
    }
    default: {
      currentDate.setFullYear(0);
      currentDate.setMonth(0);
      currentDate.setDate(1);
      return currentDate.getTime().toString();
    }
  }
});

const filterEndTimestamp = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  currentDate.setHours(23, 59, 59, 999);

  switch (activeFilter.value) {
    case "day": {
      return currentDate.getTime().toString();
    }
    case "month": {
      currentDate.setMonth(currentMonth + 1);
      currentDate.setDate(0);
      return currentDate.getTime().toString();
    }
    case "year": {
      currentDate.setFullYear(currentYear + 1);
      currentDate.setMonth(0);
      currentDate.setDate(0);
      return currentDate.getTime().toString();
    }
    default: {
      currentDate.setFullYear(currentYear + 1);
      currentDate.setMonth(0);
      currentDate.setDate(0);
      return currentDate.getTime().toString();
    }
  }
});

function getTransactionIds() {
  return transactionIds.value.filter((id) => id >= filterStartTimestamp.value);
}
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Currency">
      <template #default>
        <RouterLink :to="{ name: 'currency-categories' }">
          <TagIcon class="size-full p-5" />
        </RouterLink>
      </template>
    </TheHeader>

    <div class="grow bg-neutral-800 overflow-y-auto pt-2 pb-20 pl-2 [scrollbar-gutter:stable]">
      <div class="max-w-5xl mx-auto">
        <div class="w-full pb-2">
          <div
            class="inline-flex p-2 w-full md:min-w-80 md:w-auto bg-neutral-600/20 h-14 rounded-md gap-2"
          >
            <div
              v-for="{ label, value } in radioOptions"
              :key="value"
              class="mx-auto flex basis-0 justify-evenly gap-2 has-[:checked]:bg-neutral-700 hover:bg-neutral-700 rounded grow flex-wrap"
            >
              <input
                :id="value"
                v-model="activeFilter"
                :value="value"
                class="peer/radio hidden"
                type="radio"
                name="activeFilter"
              />
              <label
                :for="value"
                class="peer-checked/radio:text-green-400 font-bold w-full leading-10 text-center cursor-pointer select-none"
                v-text="label"
              ></label>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col gap-2">
        <TransitionGroup name="list">
          <TransactionItem
            v-for="transactionId in getTransactionIds()"
            :key="transactionId"
            :transaction-id="transactionId"
            :amount="transactionRecords[transactionId].amount"
            :type="transactionRecords[transactionId].type"
            :note="transactionRecords[transactionId].note"
            :category="categoryRecords[transactionRecords[transactionId].categoryId].name"
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
  transition: all 0.4s ease;
  user-select: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
