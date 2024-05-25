<script setup lang="ts">
import { useCurrencyStore, type TransactionDetails } from "@/stores/currency";
import { useQuestStore } from "@/stores/quest";
import { storeToRefs } from "pinia";
import CurrencyIcon from "~icons/fluent-emoji-flat/coin";
import CalendarIcon from "~icons/fluent-emoji-flat/calendar";
import TheHeader from "@/components/TheHeader.vue";
import { computed } from "vue";
import ExpensePieChart from "@/components/Currency/ExpensePieChart.vue";

const currencyStore = useCurrencyStore();
const { transactionIds, transactionRecords, categoryRecords } = storeToRefs(currencyStore);
const { loadData: loadTransactionData } = currencyStore;

const storedTransactionData = localStorage.getItem("currencyStore");
if (storedTransactionData) {
  loadTransactionData(JSON.parse(storedTransactionData));
}

const financeTally = computed(() => {
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
});

const questStore = useQuestStore();
const { questIds } = storeToRefs(questStore);
const { loadData: loadQuestData } = questStore;

const storedQuestData = localStorage.getItem("questStore");
if (storedQuestData) {
  loadQuestData(JSON.parse(storedQuestData));
}

const expenseTally = computed(() => {
  const categories = new Map();

  const data: { value: number; name: string }[] = [];

  transactionIds.value.forEach((id) => {
    const transactionRecord: TransactionDetails = transactionRecords.value[id];
    if (transactionRecord.type !== "expense") return;

    const { amount, categoryId } = transactionRecord;
    const category = categories.get(categoryId);
    categories.set(categoryId, (category || 0) + +amount);
  });

  categories.forEach((value, key) => {
    data.push({ value: value.toFixed(2), name: categoryRecords.value[key].name });
  });

  return data;
});
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Dashboard" />

    <div class="grow bg-neutral-800 p-2 overflow-y-auto">
      <div class="h-full w-full max-w-5xl mx-auto flex flex-col gap-2">
        <RouterLink :to="{ name: 'quest' }" class="block rounded bg-neutral-700/30">
          <div class="flex items-center gap-3 rounded-t p-2 bg-neutral-700/50">
            <CalendarIcon class="size-8" />
            <span>Quests</span>
          </div>
          <div class="p-3">
            <span>{{ questIds.length }} Quests</span>
          </div>
        </RouterLink>
        <div class="block rounded bg-neutral-700/30">
          <RouterLink
            :to="{ name: 'currency' }"
            class="block rounded overflow-hidden bg-neutral-700/30"
          >
            <div class="flex items-center gap-3 rounded-t p-2 bg-neutral-700/50">
              <CurrencyIcon class="size-8" />
              <span>Currency</span>
            </div>
          </RouterLink>
          <div class="p-3 flex justify-between">
            <span class="text-green-500">Income: {{ financeTally.income.toFixed(2) }}</span>
            <span class="text-red-400">Expense: {{ financeTally.expense.toFixed(2) }}</span>
            <span :class="financeTally.balance >= 0 ? 'text-green-500' : 'text-red-400'"
              >Balance: {{ financeTally.balance.toFixed(2) }}</span
            >
          </div>
          <ExpensePieChart :data="expenseTally" />
        </div>
      </div>
    </div>
  </div>
</template>
