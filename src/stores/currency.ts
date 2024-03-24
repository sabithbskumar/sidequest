import { ref } from "vue";
import { defineStore } from "pinia";

const useCurrencyStore = defineStore("currency", () => {
  const transactionIds = ref<string[]>([]);
  const deletedTransactionIds = ref<string[]>([]);
  const transactionRecords = ref<Record<string, TransactionDetails>>({});

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
  }

  return {
    transactionIds,
    deletedTransactionIds,
    transactionRecords,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadData,
  };
});

interface Transaction {
  amount: string;
  type: string;
  note: string;
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
}

export { useCurrencyStore };
export type { Transaction, TransactionMetadata, TransactionDetails };
