<template>
  <s-echarts :options="option" :theme="theme" :update-options="{ notMerge: true }" />
</template>

<script setup lang="ts">
import * as echarts from "echarts/core";
import { TooltipComponent, GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useChart } from "@/hooks/useChart";

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

// :update-options="{ notMerge: true }" 用于更新图表时，不合并配置项，避免theme覆盖自定义isDark配置
// see: https://echarts.apache.org/zh/api.html#echartsInstance.setOption

const { option, theme } = useChart((isDark, palette) => {
  return {
    backgroundColor: "transparent",
    color: palette,
    tooltip: {
      trigger: "axis",
      borderWidth: 0,
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: isDark ? "rgba(247, 248, 250,0.03)" : "rgba(0, 0, 0,0.03)"
        }
      },
      formatter: (params: any) => {
        let item = params[0];
        const color = item.color;
        return `<b>${item.name}</b><br/><span style="display:inline-block;margin-right:4px;width:10px;height:10px;background-color:${color};"></span> ${item.name} <b style="margin-left: 16px">${item.value}</b>`;
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },

    xAxis: [
      {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        axisLabel: {
          color: "#86909c"
        },
        axisLine: {
          lineStyle: {
            color: isDark ? "#373738" : "#ebedf0"
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#86909c"
        },
        splitLine: {
          lineStyle: {
            color: isDark ? "#373738" : "#ebedf0"
          }
        }
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: "15%",
        data: [226, 136, 101, 147, 108, 147, 114, 131, 118, 111, 117, 120]
      }
    ]
  };
});
</script>
