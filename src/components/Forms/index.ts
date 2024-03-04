import type { Transaction } from "@/stores/currency";
import type { Quest } from "@/stores/quest";
import TransactionForm from "./TransactionForm.vue";
import QuestForm from "./QuestForm.vue";
import type { Note } from "@/stores/notes";

interface TransactionFormData {
  id: string;
  transaction: Transaction;
}

interface QuestFormData {
  id: string;
  quest: Quest;
}

interface NoteFormData {
  id: string;
  note: Note;
}

export { TransactionForm, QuestForm };
export type { TransactionFormData, QuestFormData, NoteFormData };
