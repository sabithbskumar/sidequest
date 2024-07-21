<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";

function exportData() {
  const data: Record<string, any> = {};

  const questStore = localStorage.getItem("questStore");
  if (questStore) data["questStore"] = JSON.parse(questStore);

  const currencyStore = localStorage.getItem("currencyStore");
  if (currencyStore) data["currencyStore"] = JSON.parse(currencyStore);

  const notesStore = localStorage.getItem("notesStore");
  if (notesStore) data["notesStore"] = JSON.parse(notesStore);

  download(`side_quest_data_${new Date().toISOString()}.json`, JSON.stringify(data));
}

function download(filename: string, data: any) {
  const link = document.createElement("a");
  const blob = new Blob([data], { type: "application/json" });
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", filename);
  link.click();
}
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Settings" />
    <div class="grow bg-neutral-800 p-2 overflow-y-auto">
      <button class="bg-neutral-700 px-3 py-2 rounded inline-flex items-center" @click="exportData">
        Export Data
      </button>
    </div>
  </div>
</template>
