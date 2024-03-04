<script setup lang="ts">
import MainLayout from "@/components/MainLayout.vue";
import { SidebarPanel } from "@/components/Sidebar";
import CurrencyIcon from "~icons/fluent-emoji-flat/coin";
import CalendarIcon from "~icons/fluent-emoji-flat/calendar";
import NoteIcon from "~icons/fluent-emoji-flat/notebook";

const links = [
  {
    label: "Quest",
    name: "quest",
    icon: CalendarIcon,
  },
  {
    label: "Currency",
    name: "currency",
    icon: CurrencyIcon,
  },
  {
    label: "Notes",
    name: "notes",
    icon: NoteIcon,
  },
];
</script>

<template>
  <MainLayout>
    <template #sidebar>
      <SidebarPanel :links="links" />
    </template>
    <template #default>
      <RouterView />
    </template>
  </MainLayout>
</template>
