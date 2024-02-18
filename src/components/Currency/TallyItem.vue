<script setup lang="ts">
defineProps<{ type: string; value: number }>();
function getTextColor(type: string, value: number) {
  switch (type) {
    case "income":
      return "text-green-500";
    case "expense":
      return "text-red-500";
    case "balance": {
      if (value >= 0) return "text-green-500";
      else return "text-red-500";
    }
  }
}
</script>

<template>
  <div class="px-8 py-1 text-sm overflow-clip flex flex-col items-center">
    <span class="font-bold capitalize">{{ type }}</span>
    <span class="font-semibold" :class="getTextColor(type, value)">{{ value.toFixed(2) }}</span>
  </div>
</template>
