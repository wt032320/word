<template>
  <div class="statis">
    <div class="main" ref="main"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data() {
    return {};
  },
  mounted() {
    var chartDom = this.$refs.main;
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: "单词数目",
      },
      tooltip: {
        trigger: "axis",
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "记忆数目",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    };
    myChart.setOption(option);
  },
};
</script>
<style scoped>
.main {
  width: 90vw;
  height: 110vw;
}
.statis {
  display: flex;
  justify-content: center;
  padding: 5vw;
  text-align: center;
}
</style>