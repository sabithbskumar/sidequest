<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { useNotesStore } from "@/stores/notes";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const notesStore = useNotesStore();
const { noteRecords } = storeToRefs(notesStore);
const { updateNote, loadData } = notesStore;
import BackIcon from "~icons/material-symbols-light/arrow-back-ios-new-rounded";
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import SaveIcon from "~icons/material-symbols-light/save";

const storedData = localStorage.getItem("notesStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(notesStore, () => {
  const stringifiedStore = JSON.stringify(notesStore.$state);
  localStorage.setItem("notesStore", stringifiedStore);
});

const route = useRoute();
const router = useRouter();

const noteId = route.params.noteId as string;
const isEditing = ref(false);
const formValues = ref(getNoteData());

function getNoteData() {
  if (noteId)
    return {
      id: noteId,
      note: {
        ...noteRecords.value[noteId],
      },
    };
  else return { id: "", note: { heading: "", content: "" } };
}

const handleBack = () => router.replace({ name: "notes" });

const handleEdit = () => (isEditing.value = true);

const handleSubmit = () => {
  updateNote({ id: noteId, note: formValues.value.note });
  isEditing.value = false;
};
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Note">
      <template #before>
        <button
          class="size-16 shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 ring-inset rounded focus-visible:text-green-500 hover:text-green-500"
          @click="handleBack"
        >
          <BackIcon class="size-full p-5" />
        </button>
      </template>
      <button
        v-if="isEditing"
        class="size-16 shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 ring-inset rounded focus-visible:text-green-500 hover:text-green-500"
        @click="handleSubmit"
      >
        <SaveIcon class="size-full p-5" />
      </button>
      <button
        v-else
        class="size-16 shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 ring-inset rounded focus-visible:text-green-500 hover:text-green-500"
        @click="handleEdit"
      >
        <EditIcon class="size-full p-5" />
      </button>
    </TheHeader>

    <form class="grow flex flex-col" @submit.prevent="handleSubmit">
      <div class="h-14">
        <input
          v-model="formValues.note.heading"
          type="text"
          class="size-full px-2 bg-neutral-800 outline-none font-bold"
          :disabled="!isEditing"
        />
      </div>
      <div class="grow bg-neutral-800 border-t border-neutral-700/40">
        <textarea
          v-model="formValues.note.content"
          class="size-full resize-none outline-none bg-neutral-800 p-2"
          :disabled="!isEditing"
        ></textarea>
      </div>
    </form>
  </div>
</template>
