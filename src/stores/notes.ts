import { ref } from "vue";
import { defineStore } from "pinia";

const useNotesStore = defineStore("notes", () => {
  const noteIds = ref<string[]>([]);
  const deletedNoteIds = ref<string[]>([]);
  const noteRecords = ref<Record<string, NoteDetails>>({});

  function addNote({ id, note }: { id: string; note: Note }) {
    const dateCreated = Date.now().toString();

    noteIds.value.unshift(id);
    noteRecords.value[id] = {
      ...note,
      dateCreated: dateCreated,
      dateUpdated: dateCreated,
    };
  }

  function updateNote({ id, note }: { id: string; note: Note }) {
    const dateUpdated = Date.now().toString();

    noteRecords.value[id] = {
      ...note,
      dateCreated: noteRecords.value[id].dateCreated,
      dateUpdated: dateUpdated,
    };
  }

  function deleteNote({ id }: { id: string }) {
    noteIds.value = noteIds.value.filter((note) => note !== id);
    deletedNoteIds.value.unshift(id);
  }

  function loadData(storedData: NoteStore) {
    noteIds.value = storedData.noteIds;
    noteRecords.value = storedData.noteRecords;
  }

  return {
    noteIds,
    deletedNoteIds,
    noteRecords,
    addNote,
    updateNote,
    deleteNote,
    loadData,
  };
});

interface Note {
  heading: string;
  content: string;
}

interface NoteMetadata {
  dateCreated: string;
  dateUpdated: string;
}

type NoteDetails = Note & NoteMetadata;

interface NoteStore {
  noteIds: string[];
  noteRecords: Record<string, NoteDetails>;
}

export { useNotesStore };
export type { Note, NoteMetadata, NoteDetails };
