import { ref } from "vue";
import { defineStore } from "pinia";

const useQuestStore = defineStore("quest", () => {
  const questIds = ref<string[]>([]);
  const deletedQuestIds = ref<string[]>([]);
  const questRecords = ref<Record<string, QuestDetails>>({});

  function addQuest({ id, quest }: { id: string; quest: Quest }) {
    const dateCreated = Date.now().toString();

    questIds.value.unshift(id);
    questRecords.value[id] = {
      ...quest,
      dateCreated: dateCreated,
      dateUpdated: dateCreated,
    };
  }

  function updateQuest({ id, quest }: { id: string; quest: Quest }) {
    const dateUpdated = Date.now().toString();

    questRecords.value[id] = {
      ...quest,
      dateCreated: questRecords.value[id].dateCreated,
      dateUpdated: dateUpdated,
    };
  }

  function toggleQuest({ id }: { id: string }) {
    questRecords.value[id].completed = !questRecords.value[id].completed;
  }

  function deleteQuest({ id }: { id: string }) {
    questIds.value = questIds.value.filter((quest) => quest !== id);
    deletedQuestIds.value.unshift(id);
  }

  function loadData(storedData: QuestStore) {
    questIds.value = storedData.questIds;
    questRecords.value = storedData.questRecords;
  }

  return {
    questIds,
    deletedQuestIds,
    questRecords,
    addQuest,
    updateQuest,
    toggleQuest,
    deleteQuest,
    loadData,
  };
});

interface Quest {
  title: string;
  completed: boolean;
}

interface QuestMetadata {
  dateCreated: string;
  dateUpdated: string;
}

type QuestDetails = Quest & QuestMetadata;

interface QuestStore {
  questIds: string[];
  questRecords: Record<string, QuestDetails>;
}

export { useQuestStore };
export type { Quest, QuestMetadata, QuestDetails };
