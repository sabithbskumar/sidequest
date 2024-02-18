<script setup lang="ts">
import { ref, watch } from "vue";
import GlassModal from "@/components/GlassModal.vue";
import AddIcon from "~icons/material-symbols-light/add-rounded";
import QuestItem from "@/components/Quest/QuestItem.vue";
import { useQuestStore } from "@/stores/quest";
import { storeToRefs } from "pinia";
import { QuestForm } from "@/components/Forms";
import type { QuestFormData } from "@/components/Forms";

const questStore = useQuestStore();
const { questIds, questRecords } = storeToRefs(questStore);
const { addQuest, updateQuest, toggleQuest, deleteQuest, loadData } = questStore;

const storedData = localStorage.getItem("questStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(questStore, () => {
  const stringifiedStore = JSON.stringify(questStore.$state);
  localStorage.setItem("questStore", stringifiedStore);
});

const isModalVisible = ref(false);
function openModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
  editedQuestId.value = null;
}

const editedQuestId = ref<null | string>(null);
function getFormData() {
  if (editedQuestId.value)
    return {
      id: editedQuestId.value,
      quest: {
        ...questRecords.value[editedQuestId.value],
      },
    };
  else return { id: "", quest: { title: "", completed: false } };
}
function getFormOptions() {
  if (editedQuestId.value) return { heading: "Edit Quest", primaryLabel: "Edit" };
  else return { heading: "Add Quest", primaryLabel: "Add" };
}

const handleEdit = (id: string) => {
  editedQuestId.value = id;
  openModal();
};

const handleToggle = (id: string) => {
  toggleQuest({ id });
};

const handleSubmit = (formData: QuestFormData) => {
  if (formData.id === "") {
    const id = Date.now().toString();
    addQuest({ id, quest: formData.quest });
  } else {
    updateQuest({ id: formData.id, quest: formData.quest });
  }
  editedQuestId.value = null;
};

const handleDelete = (id: string) => {
  deleteQuest({ id });
};

const handleClick = (id: string) => {
  if (activeQuestId.value === id) activeQuestId.value = "";
  else activeQuestId.value = id;
};

const activeQuestId = ref("");
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <div class="flex justify-between align-middle bg-neutral-700/50 shadow-lg h-full max-h-16">
      <div class="p-4 h-full px-3 text-xl font-semibold">
        <span>Quest</span>
      </div>
    </div>
    <div class="grow bg-neutral-800 overflow-y-auto pt-2 pb-20 pl-2 [scrollbar-gutter:stable]">
      <div class="w-full flex flex-col gap-2">
        <TransitionGroup name="list">
          <QuestItem
            v-for="questId in questIds"
            :key="questId"
            :quest-id="questId"
            :title="questRecords[questId].title"
            :is-completed="questRecords[questId].completed"
            :active-quest-id="activeQuestId"
            :show-actions="activeQuestId === questId"
            @toggle="handleToggle"
            @delete="handleDelete"
            @click="handleClick"
            @edit="handleEdit"
          />
        </TransitionGroup>
      </div>
    </div>

    <button class="absolute bottom-3 right-3 size-14 rounded-2xl bg-green-500" @click="openModal">
      <AddIcon class="size-full p-2" />
    </button>
    <GlassModal :is-visble="isModalVisible" @close="closeModal">
      <QuestForm
        :form-data="getFormData()"
        :form-options="getFormOptions()"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </GlassModal>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
  user-select: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
  right: 0;
  width: 100%;
}
</style>
