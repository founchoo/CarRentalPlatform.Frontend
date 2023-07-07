<template>
  <div id="main" style="height: 75vh; width: 100%;">
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'

type EChartsOption = echarts.EChartsOption

let option: EChartsOption

const props = defineProps({
  /**
   * 必需项，传入一个函数，该函数返回一个数组，数组中的每个元素是一个对象，该对象是饼状图的显示数据。
   * 对象中必须包含 value 和 name 两个属性。
   */
  func: {
    type: Function,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  xAxisData: {
    type: Function,
    required: true
  },
  getLegendData: {
    type: Function,
    required: true
  }
})

onMounted(async () => {
  await drawChart()
})

const drawChart = async () => {

  option = {
    title: {
      text: props.title
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: await props.getLegendData()
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: await props.xAxisData()
    },
    yAxis: {
      type: 'value'
    },
    series: await props.func()
  };

  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom)
  option && myChart.setOption(option)
}

</script>
<style scoped></style>