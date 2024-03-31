import { ref } from "vue";
import { defineStore } from "pinia";

const useCurrencyStore = defineStore("currency", () => {
  const transactionIds = ref<string[]>([]);
  const deletedTransactionIds = ref<string[]>([]);
  const transactionRecords = ref<Record<string, TransactionDetails>>({});
  const categoryIds = ref<string[]>([]);
  const categoryRecords = ref<Record<string, TransactionCategory>>({});

  function addTransaction({ id, transaction }: { id: string; transaction: Transaction }) {
    const dateCreated = Date.now().toString();

    transactionIds.value.unshift(id);
    transactionRecords.value[id] = {
      ...transaction,
      dateCreated: dateCreated,
      dateUpdated: dateCreated,
    };
  }

  function updateTransaction({ id, transaction }: { id: string; transaction: Transaction }) {
    const dateUpdated = Date.now().toString();

    transactionRecords.value[id] = {
      ...transaction,
      dateCreated: transactionRecords.value[id].dateCreated,
      dateUpdated: dateUpdated,
    };
  }

  function deleteTransaction({ id }: { id: string }) {
    transactionIds.value = transactionIds.value.filter((transaction) => transaction !== id);
    deletedTransactionIds.value.unshift(id);
  }

  function loadData(storedData: CurrencyStore) {
    transactionIds.value = storedData.transactionIds;
    deletedTransactionIds.value = storedData.deletedTransactionIds;
    transactionRecords.value = storedData.transactionRecords;

    categoryIds.value = storedData.categoryIds;
    categoryRecords.value = storedData.categoryRecords;
  }

  function addCategory({ id, category }: { id: string; category: TransactionCategory }) {
    categoryIds.value.unshift(id);
    categoryRecords.value[id] = category;
  }

  function updateCategory({ id, category }: { id: string; category: TransactionCategory }) {
    categoryRecords.value[id] = category;
  }

  function deleteCategory({ id }: { id: string }) {
    categoryIds.value = categoryIds.value.filter((category) => category !== id);
  }

  return {
    transactionIds,
    deletedTransactionIds,
    transactionRecords,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadData,
    categoryIds,
    categoryRecords,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});

type TransactionType = "income" | "expense";

interface Transaction {
  amount: string;
  type: TransactionType;
  note: string;
  categoryId: string;
}

interface TransactionMetadata {
  dateCreated: string;
  dateUpdated: string;
}

type TransactionDetails = Transaction & TransactionMetadata;

interface CurrencyStore {
  transactionIds: string[];
  deletedTransactionIds: string[];
  transactionRecords: Record<string, TransactionDetails>;
  categoryIds: string[];
  categoryRecords: Record<string, TransactionCategory>;
}

interface TransactionCategory {
  name: string;
  type: TransactionType;
}

export { useCurrencyStore };
export type { Transaction, TransactionMetadata, TransactionDetails, TransactionCategory };
