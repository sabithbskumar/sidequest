<script setup lang="ts">
import { TransactionCategoryForm, type TransactionCategoryFormData } from "@/components/Forms";
import GlassModal from "@/components/GlassModal.vue";
import TheHeader from "@/components/TheHeader.vue";
import { useCurrencyStore, type TransactionCategory } from "@/stores/currency";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AddIcon from "~icons/material-symbols-light/add-rounded";
import BackIcon from "~icons/material-symbols-light/arrow-back-ios-new-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";
import EditIcon from "~icons/material-symbols-light/edit-rounded";

const currencyStore = useCurrencyStore();
const { categoryIds, categoryRecords } = storeToRefs(currencyStore);
const { addCategory, updateCategory, deleteCategory, loadData } = currencyStore;

const storedData = localStorage.getItem("currencyStore");
if (storedData) {
  loadData(JSON.parse(storedData));
}
watch(currencyStore, () => {
  const stringifiedStore = JSON.stringify(currencyStore.$state);
  localStorage.setItem("currencyStore", stringifiedStore);
});

const router = useRouter();
const handleBack = () => router.replace({ name: "currency" });

const incomeCategoryIds = computed(() =>
  categoryIds.value.filter((id) => categoryRecords.value[id].type === "income"),
);

const expenseCategoryIds = computed(() =>
  categoryIds.value.filter((id) => categoryRecords.value[id].type === "expense"),
);

const isModalVisible = ref(false);

function openModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
  editedCategoryId.value = null;
}

const editedCategoryId = ref<null | string>(null);

function getFormData(): { id: string; category: TransactionCategory } {
  if (editedCategoryId.value)
    return {
      id: editedCategoryId.value,
      category: {
        ...categoryRecords.value[editedCategoryId.value],
      },
    };
  else return { id: "", category: { name: "", symbol: "", type: "expense" } };
}
function getFormOptions() {
  if (editedCategoryId.value) return { heading: "Edit Category", primaryLabel: "Edit" };
  else return { heading: "Add Category", primaryLabel: "Add" };
}
const handleEdit = (id: string) => {
  editedCategoryId.value = id;
  openModal();
};

const handleSubmit = (formData: TransactionCategoryFormData) => {
  if (formData.id === "") {
    const id = Date.now().toString();
    addCategory({ id, category: formData.category });
  } else {
    updateCategory({ id: formData.id, category: formData.category });
  }
  editedCategoryId.value = null;
};

const handleDelete = (id: string) => {
  deleteCategory({ id });
};
</script>

<template>
  <div class="size-full flex flex-col relative bg-neutral-900">
    <TheHeader heading="Categories">
      <template #before>
        <button
          class="size-16 shrink-0 flex items-center justify-center outline-none focus-visible:ring-2 ring-inset rounded focus-visible:text-green-500 hover:text-green-500"
          @click="handleBack"
        >
          <BackIcon class="size-full p-5" />
        </button>
      </template>
    </TheHeader>

    <div class="grow bg-neutral-800 overflow-y-auto pt-2 pb-20 pl-2 [scrollbar-gutter:stable]">
      <div class="w-full">
        <div class="max mx-auto w-full max-w-5xl flex flex-col lg:flex-row gap-2">
          <div class="grow shrink-0 w-full md:basis-0 flex flex-col gap-2">
            <span>Income</span>
            <div
              v-for="categoryId in incomeCategoryIds"
              :key="categoryId"
              class="flex justify-between h-14 overflow-clip"
            >
              <div
                class="grow h-full inline-flex items-center overflow-hidden rounded bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm group/category focus-within:ring-0 focus-within:outline-none focus-within:bg-opacity-80"
                tabindex="0"
              >
                <div class="inline-flex h-full items-center w-full p-2">
                  <span
                    class="size-10 shrink-0 truncate inline-flex items-center justify-center rounded-sm pointer-events-none text-neutral-100 font-bold shadow bg-green-500/20"
                    v-text="
                      categoryRecords[categoryId].symbol || categoryRecords[categoryId].name[0]
                    "
                  ></span>
                  <span
                    class="truncate pointer-events-none px-3 text-neutral-100 font-medium"
                    v-text="categoryRecords[categoryId].name"
                  ></span>
                </div>
                <div
                  class="ml-auto h-full hidden group-hover/category:inline-flex group-focus-within/category:inline-flex"
                >
                  <button
                    type="button"
                    class="outline-none text-neutral-400 hover:text-white focus-visible:ring-inset focus-visible:ring rounded"
                    @click="handleEdit(categoryId)"
                  >
                    <EditIcon class="size-14 p-3 shrink-0" />
                  </button>
                  <button
                    class="outline-none text-neutral-400 hover:text-red-400 focus-visible:ring-inset focus-visible:ring rounded"
                    type="button"
                    @click="handleDelete(categoryId)"
                  >
                    <DeleteIcon class="size-14 p-3 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grow shrink-0 w-full md:basis-0 flex flex-col gap-2">
            <span>Expense</span>
            <div
              v-for="categoryId in expenseCategoryIds"
              :key="categoryId"
              class="flex justify-between h-14 overflow-clip"
            >
              <div
                class="grow h-full inline-flex items-center overflow-hidden rounded bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm group/category focus-within:ring-0 focus-within:outline-none focus-within:bg-opacity-80"
                tabindex="0"
              >
                <div class="inline-flex h-full items-center w-full p-2">
                  <span
                    class="size-10 shrink-0 truncate inline-flex items-center justify-center rounded-sm pointer-events-none text-neutral-100 font-bold shadow bg-red-500/20"
                    v-text="
                      categoryRecords[categoryId].symbol || categoryRecords[categoryId].name[0]
                    "
                  ></span>
                  <span
                    class="truncate pointer-events-none px-3 text-neutral-100 font-medium"
                    v-text="categoryRecords[categoryId].name"
                  ></span>
                </div>
                <div
                  class="ml-auto h-full hidden group-hover/category:inline-flex group-focus-within/category:inline-flex"
                >
                  <button
                    type="button"
                    class="outline-none text-neutral-400 hover:text-white focus-visible:ring-inset focus-visible:ring rounded"
                    @click="handleEdit(categoryId)"
                  >
                    <EditIcon class="size-14 p-3 shrink-0" />
                  </button>
                  <button
                    class="outline-none text-neutral-400 hover:text-red-400 focus-visible:ring-inset focus-visible:ring rounded"
                    type="button"
                    @click="handleDelete(categoryId)"
                  >
                    <DeleteIcon class="size-14 p-3 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute pointer-events-none bottom-0 left-0 right-0 p-3 h-20 flex gap-2 justify-between"
      >
        <button
          class="ml-auto size-14 rounded-2xl bg-green-500 shrink-0 pointer-events-auto"
          @click="openModal"
        >
          <AddIcon class="size-full p-2" />
        </button>
      </div>
      <GlassModal :is-visble="isModalVisible" @close="closeModal">
        <TransactionCategoryForm
          :form-data="getFormData()"
          :form-options="getFormOptions()"
          @cancel="closeModal"
          @submit="handleSubmit"
        />
      </GlassModal>
    </div>
  </div>
</template>

<style scoped>
.action-buttons-enter-active,
.action-buttons-leave-active {
  transition: all 0.2s ease;
}

.action-buttons-enter-from,
.action-buttons-leave-to {
  transform: translateX(100%);
}
</style>
