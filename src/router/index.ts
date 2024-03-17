import CurrencyView from "@/views/CurrencyView.vue";
import DashboardView from "@/views/DashboardView.vue";
import NoteDetailsView from "@/views/NoteDetailsView.vue";
import NotesView from "@/views/NotesView.vue";
import QuestView from "@/views/QuestView.vue";
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
      name: "currency",
      component: CurrencyView,
    },
    {
      path: "/notes",
      name: "notes",
      component: NotesView,
    },
    {
      path: "/notes/:noteId",
      name: "note-details",
      component: NoteDetailsView,
    },
  ],
});

export default router;
