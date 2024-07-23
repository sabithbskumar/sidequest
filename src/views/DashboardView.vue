<script setup lang="ts">
import { useCurrencyStore, type TransactionDetails } from "@/stores/currency";
import { useQuestStore } from "@/stores/quest";
import { storeToRefs } from "pinia";
import NoteIcon from "~icons/fluent-emoji-flat/notebook";
import CalendarIcon from "~icons/fluent-emoji-flat/calendar";
import TheHeader from "@/components/TheHeader.vue";
import { computed, watch } from "vue";
import ExpensePieChart from "@/components/Currency/ExpensePieChart.vue";
import { ref } from "vue";
import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
import IconRight from "~icons/material-symbols-light/arrow-right-rounded";
import { useNotesStore } from "@/stores/notes";
import { RouterLink } from "vue-router";

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

      const amount = parseFloat(record.amount);

      switch (record.type) {
        case "income": {
          if (
            +transactionId >= relativeTimestamp.value.start &&
            +transactionId <= relativeTimestamp.value.end
          )
            next.income = previous.income + amount;
          if (+transactionId <= relativeTimestamp.value.end)
            next.balance = previous.balance + amount;
          break;
        }
        case "expense": {
          if (
            +transactionId >= relativeTimestamp.value.start &&
            +transactionId <= relativeTimestamp.value.end
          )
            next.expense = previous.expense + amount;
          if (+transactionId <= relativeTimestamp.value.end)
            next.balance = previous.balance - amount;
          break;
        }
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

const notesStore = useNotesStore();
const { noteIds } = storeToRefs(notesStore);
const { loadData: loadNotesData } = notesStore;

const storedNotesData = localStorage.getItem("notesStore");
if (storedNotesData) {
  loadNotesData(JSON.parse(storedNotesData));
}

const expenseTally = computed(() => {
  const categories = new Map();

  const data: { value: number; name: string }[] = [];

  getTransactionIds().forEach((id) => {
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
const timestampOffset = ref(0);

watch(activeFilter, () => (timestampOffset.value = 0));

const relativeTimestamp = computed(() => {
  const today = new Date();

  const month = { start: 0, end: 11 };
  const hour = { start: 0, end: 23 };
  const minute = { start: 0, end: 59 };
  const second = { start: 0, end: 59 };
  const millisecond = { start: 0, end: 999 };

  switch (activeFilter.value) {
    case "day": {
      const startTimestamp = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + timestampOffset.value,
        hour.start,
        minute.start,
        second.start,
        millisecond.start,
      ).getTime();
      const endTimestamp = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + timestampOffset.value,
        hour.end,
        minute.end,
        second.end,
        millisecond.end,
      ).getTime();
      return { start: startTimestamp, end: endTimestamp };
    }
    case "month": {
      const startTimestamp = new Date(
        today.getFullYear(),
        today.getMonth() + timestampOffset.value,
        1, // First Day
        hour.start,
        minute.start,
        second.start,
        millisecond.start,
      ).getTime();
      const endTimestamp = new Date(
        today.getFullYear(),
        today.getMonth() + 1 + timestampOffset.value,
        0, // Last Day of the previous month
        hour.end,
        minute.end,
        second.end,
        millisecond.end,
      ).getTime();
      return { start: startTimestamp, end: endTimestamp };
    }
    case "year": {
      const startTimestamp = new Date(
        today.getFullYear() + timestampOffset.value,
        month.start,
        1, // First Day
        hour.start,
        minute.start,
        second.start,
        millisecond.start,
      ).getTime();
      const endTimestamp = new Date(
        today.getFullYear() + timestampOffset.value,
        month.end,
        31, // Last Day of December
        hour.end,
        minute.end,
        second.end,
        millisecond.end,
      ).getTime();
      return { start: startTimestamp, end: endTimestamp };
    }
    default: {
      const startTimestamp = new Date(-8640000000000000).getTime();
      const endTimestamp = new Date(8640000000000000).getTime();
      return { start: startTimestamp, end: endTimestamp };
    }
  }
});

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const filterRange = computed(() => {
  const today = new Date(relativeTimestamp.value.start);
  switch (activeFilter.value) {
    case "day": {
      return `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }
    case "month": {
      return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }
    case "year": {
      return `${today.getFullYear()}`;
    }
    default: {
      return "All";
    }
  }
});

function getTransactionIds() {
  return transactionIds.value.filter(
    (id) => +id >= relativeTimestamp.value.start && +id <= relativeTimestamp.value.end,
  );
}
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Dashboard" />

    <div class="size-full bg-neutral-800 overflow-hidden">
      <div
        class="size-full mx-auto max-w-screen-2xl p-2 max-xl:pr-0 flex max-xl:flex-col gap-2 overflow-y-auto"
      >
        <div class="max-xl:w-full xl:w-4/12 shrink-0 grid gap-2 grid-rows-2">
          <div class="rounded">
            <div class="block rounded bg-neutral-700/30 h-full">
              <RouterLink
                :to="{ name: 'quest' }"
                class="flex items-center gap-3 rounded-t p-2 bg-neutral-700/50"
              >
                <CalendarIcon class="size-8" />
                <span>Quests</span>
              </RouterLink>
              <div class="p-3">
                <span>{{ questIds.length }} Quests</span>
              </div>
            </div>
          </div>
          <div class="rounded">
            <div class="block rounded bg-neutral-700/30 h-full">
              <RouterLink
                :to="{ name: 'notes' }"
                class="flex items-center gap-3 rounded-t p-2 bg-neutral-700/50"
              >
                <NoteIcon class="size-8" />
                <span>Notes</span>
              </RouterLink>
              <div class="p-3">
                <span>{{ noteIds.length }} Notes</span>
              </div>
            </div>
          </div>
        </div>
        <div class="grow h-full shrink-0 flex flex-col gap-2">
          <div class="w-full grid md:grid-cols-12 gap-2">
            <div class="md:col-span-5 inline-flex p-2 bg-neutral-600/20 h-14 rounded-md gap-2">
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
            <div
              class="md:col-span-7 inline-flex p-2 justify-between items-center md:min-w-80 md:w-auto bg-neutral-600/20 h-14 rounded-md gap-2"
            >
              <button
                class="size-10 bg-neutral-500 bg-opacity-10 hover:bg-opacity-30 rounded"
                @click="timestampOffset -= 1"
              >
                <IconLeft class="text-2xl size-full" />
              </button>
              <div class="flex flex-col">
                <span v-text="filterRange"></span>
              </div>
              <button
                class="size-10 bg-neutral-500 bg-opacity-10 hover:bg-opacity-30 rounded"
                @click="timestampOffset += 1"
              >
                <IconRight class="tex-2xl size-full" />
              </button>
            </div>
          </div>
          <div class="grow size-full grid grid-cols-12 grid-rows-12 gap-2">
            <span
              class="col-span-4 row-span-1 md:row-span-2 rounded bg-neutral-700/30 inline-flex justify-center items-center font-bold text-green-500"
            >
              Income: {{ financeTally.income.toFixed(2) }}
            </span>
            <span
              class="col-span-4 row-span-1 md:row-span-2 rounded bg-neutral-700/30 inline-flex justify-center items-center font-bold text-red-400"
            >
              Expense: {{ financeTally.expense.toFixed(2) }}
            </span>
            <span
              class="col-span-4 row-span-1 md:row-span-2 rounded bg-neutral-700/30 inline-flex justify-center items-center font-bold"
              :class="financeTally.balance >= 0 ? 'text-green-500' : 'text-red-400'"
            >
              Balance: {{ financeTally.balance.toFixed(2) }}
            </span>
            <div
              class="col-span-full row-span-11 md:row-span-10 bg-neutral-700/30 rounded grid items-center"
            >
              <ExpensePieChart :data="expenseTally" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
