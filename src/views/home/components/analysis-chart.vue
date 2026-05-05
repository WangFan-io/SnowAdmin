<template>
  <s-echarts :options="option" :theme="theme" />
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { useChart } from "@/hooks/useChart";

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

const { option, theme } = useChart((_, palette) => {
  return {
    backgroundColor: "transparent",
    color: palette,
    tooltip: {
      trigger: "item",
      borderWidth: 0,
      formatter: (params: any) => {
        return `<b>${params.name}</b><br/>${params.marker} ${params.name} <b style="margin-left: 16px">${params.percent}%</b>`;
      }
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "35%",
      icon: "circle",
      itemHeight: 10,
      itemGap: 14,
      data: ["固定资产", "无形资产", "长期待摊", "投资性房产", "流动资产", "其它"]
    },
    series: [
      {
        type: "pie",
        left: 80,
        padAngle: 1,
        radius: ["45%", "70%"],
        label: {
          color: "inherit"
        },
        data: [
          { name: "固定资产", value: 46.6 },
          { name: "无形资产", value: 27.72 },
          { name: "长期待摊", value: 8.13 },
          { name: "投资性房产", value: 5 },
          { name: "流动资产", value: 3.63 },
          { name: "其它", value: 2.83 }
        ],
        emphasis: {
          scale: true,
          scaleSize: 10
        }
      }
    ]
  };
});
</script>

<style lang="scss" scoped></style>
