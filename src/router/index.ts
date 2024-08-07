import CurrencyView from "@/views/CurrencyView.vue";
import DashboardView from "@/views/DashboardView.vue";
import NoteDetailsView from "@/views/NoteDetailsView.vue";
import NotesView from "@/views/NotesView.vue";
import QuestView from "@/views/QuestView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TransactionCategoriesView from "@/views/TransactionCategoriesView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/quest",
      name: "quest",
      component: QuestView,
    },
    {
      path: "/currency",
      children: [
        {
          path: "",
          name: "currency",
          component: CurrencyView,
        },
        {
          path: "categories",
          name: "currency-categories",
          component: TransactionCategoriesView,
        },
      ],
    },
    {
      path: "/notes",
      children: [
        {
          path: "",
          name: "notes",
          component: NotesView,
        },
        {
          path: ":noteId",
          name: "note-details",
          component: NoteDetailsView,
        },
      ],
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
  ],
});

export default router;
