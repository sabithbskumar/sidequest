import type { Transaction } from "@/stores/currency";
import type { Quest } from "@/stores/quest";
import TransactionForm from "./TransactionForm.vue";
import QuestForm from "./QuestForm.vue";

interface TransactionFormData {
  id: string;
  transaction: Transaction;
}

interface QuestFormData {
  id: string;
  quest: Quest;
}

export { TransactionForm, QuestForm };
export type { TransactionFormData, QuestFormData };
