<script setup lang="ts">
import { useCurrencyStore } from "@/stores/currency";
import { useQuestStore } from "@/stores/quest";
import { storeToRefs } from "pinia";
import CurrencyIcon from "~icons/fluent-emoji-flat/coin";
import CalendarIcon from "~icons/fluent-emoji-flat/calendar";
import TheHeader from "@/components/TheHeader.vue";

const currencyStore = useCurrencyStore();
const { transactionIds, transactionRecords } = storeToRefs(currencyStore);
const { loadData: loadTransactionData } = currencyStore;

const storedTransactionData = localStorage.getItem("currencyStore");
if (storedTransactionData) {
  loadTransactionData(JSON.parse(storedTransactionData));
}
function getBalance() {
  return transactionIds.value.reduce((balance, transactionId) => {
    const record = transactionRecords.value[transactionId];
    switch (record.type) {
      case "income":
        return balance + parseFloat(record.amount);
      case "expense":
        return balance - parseFloat(record.amount);
    }
    return balance;
  }, 0);
}

const questStore = useQuestStore();
const { questIds } = storeToRefs(questStore);
const { loadData: loadQuestData } = questStore;

const storedQuestData = localStorage.getItem("questStore");
if (storedQuestData) {
  loadQuestData(JSON.parse(storedQuestData));
}
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Dashboard" />

    <div class="grow bg-neutral-800 overflow-hidden overflow-y-auto p-2">
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
        <RouterLink :to="{ name: 'currency' }" class="block rounded bg-neutral-700/30">
          <div class="flex items-center gap-3 rounded-t p-2 bg-neutral-700/50">
            <CurrencyIcon class="size-8" />
            <span>Currency</span>
          </div>
          <div class="p-3">
            <span>Balance: {{ getBalance().toFixed(2) }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
