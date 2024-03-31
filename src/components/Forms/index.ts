import type { Transaction, TransactionCategory } from "@/stores/currency";
import type { Quest } from "@/stores/quest";
import TransactionForm from "./TransactionForm.vue";
import TransactionCategoryForm from "./TransactionCategoryForm.vue";
import QuestForm from "./QuestForm.vue";
import type { Note } from "@/stores/notes";

interface TransactionFormData {
  id: string;
  transaction: Transaction;
}

interface TransactionCategoryFormData {
  id: string;
  category: TransactionCategory;
}

interface QuestFormData {
  id: string;
  quest: Quest;
}

interface NoteFormData {
  id: string;
  note: Note;
}

export { TransactionForm, QuestForm, TransactionCategoryForm };
export type { TransactionFormData, QuestFormData, NoteFormData, TransactionCategoryFormData };
