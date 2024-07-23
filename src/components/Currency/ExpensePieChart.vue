<script setup lang="ts">
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import {
  type ComposeOption,
  type LegendComponentOption,
  type PieSeriesOption,
  type TitleComponentOption,
  type TooltipComponentOption,
} from "echarts";

const props = defineProps<{ data: { value: number; name: string }[] }>();

use([SVGRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

type EChartsOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

const option = computed<EChartsOption>(() => {
  return {
    color: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb", "#d2f5a6", "#76f2f2"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: 5,
      left: "center",
      textStyle: {
        color: "#ddd",
      },
    },
    series: [
      {
        name: "Expense",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outer",
          color: "#ddd",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
          scaleSize: 10,
        },
        labelLine: {
          show: true,
        },
        data: props.data,
      },
    ],
  };
});
</script>

<template>
  <div class="py-5 h-full">
    <VChart :option="option" :autoresize="true" />
  </div>
</template>
