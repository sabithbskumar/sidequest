<script setup lang="ts">
import { ref } from "vue";
import type { NoteFormData } from ".";

const props = defineProps<{
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  formData: NoteFormData;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [NoteFormData];
}>();

const formValues = ref(props.formData);

function handleSubmit() {
  emit("submit", formValues.value);
  handleCancel();
}

function handleCancel() {
  emit("cancel");
}

const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};
</script>

<template>
  <h2 class="text-center pt-2 pb-6 text-2xl">{{ formOptions.heading }}</h2>
  <form
    autoComplete="off"
    class="m-auto px-4 w-full grow flex flex-col gap-4 justify-between"
    @submit.prevent="handleSubmit"
  >
    <div class="flex grow flex-col gap-4">
      <input
        v-model="formValues.note.heading"
        v-focus
        type="text"
        class="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
        placeholder="Heading"
        name="heading"
        required
      />
    </div>

    <div class="flex gap-4">
      <input
        type="button"
        value="Cancel"
        class="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
        @click="handleCancel"
      />
      <input
        type="submit"
        :value="formOptions.primaryLabel"
        class="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
      />
    </div>
  </form>
</template>
