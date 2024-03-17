<script setup lang="ts">
import AddIcon from "~icons/material-symbols-light/add-rounded";
import TheHeader from "@/components/TheHeader.vue";
import NoteItem from "@/components/Notes/NoteItem.vue";
import { useNotesStore } from "@/stores/notes";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { NoteFormData } from "@/components/Forms";
import GlassModal from "@/components/GlassModal.vue";
import NoteForm from "@/components/Forms/NoteForm.vue";
import { useRouter } from "vue-router";

const notesStore = useNotesStore();
const { noteIds, noteRecords } = storeToRefs(notesStore);
const { addNote, updateNote, loadData } = notesStore;

const storedData = localStorage.getItem("notesStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(notesStore, () => {
  const stringifiedStore = JSON.stringify(notesStore.$state);
  localStorage.setItem("notesStore", stringifiedStore);
});

const isModalVisible = ref(false);
function openModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
  editedNoteId.value = null;
}

const editedNoteId = ref<null | string>(null);

function getFormData() {
  if (editedNoteId.value)
    return {
      id: editedNoteId.value,
      note: {
        ...noteRecords.value[editedNoteId.value],
      },
    };
  else return { id: "", note: { heading: "", content: "" } };
}
function getFormOptions() {
  if (editedNoteId.value) return { heading: "Edit Note", primaryLabel: "Edit" };
  else return { heading: "Add Note", primaryLabel: "Add" };
}

const router = useRouter();

const handleEdit = (id: string) => {
  router.push({ name: "note-details", params: { noteId: id } });
};

const handleSubmit = (formData: NoteFormData) => {
  if (formData.id === "") {
    const id = Date.now().toString();
    addNote({ id, note: formData.note });
  } else {
    updateNote({ id: formData.id, note: formData.note });
  }
  editedNoteId.value = null;
};
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Notes" />

    <div class="grow bg-neutral-800 overflow-y-auto pt-2 pb-20 pl-2 [scrollbar-gutter:stable]">
      <div
        class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,13rem)] px-2 pt-2 gap-4"
      >
        <NoteItem
          v-for="id in noteIds"
          :key="id"
          :data="noteRecords[id]"
          @click="
            () => {
              handleEdit(id);
            }
          "
        />
      </div>
    </div>
    <div
      class="absolute pointer-events-none bottom-0 left-0 right-0 p-3 h-20 flex gap-2 justify-end"
    >
      <button
        class="size-14 rounded-2xl bg-green-500 shrink-0 pointer-events-auto"
        @click="openModal"
      >
        <AddIcon class="size-full p-2" />
      </button>
    </div>

    <GlassModal :is-visble="isModalVisible" @close="closeModal">
      <NoteForm
        :form-data="getFormData()"
        :form-options="getFormOptions()"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </GlassModal>
  </div>
</template>
