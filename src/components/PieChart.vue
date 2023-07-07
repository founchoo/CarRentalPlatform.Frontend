<template>
	<div id="main" style="height: 80vh; width: 100%;">
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';

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
	/**
	 * 非必需项，若不传入则不显示副标题
	 */
	subtext: {
		type: String,
		default: ''
	},
	titleFontSize: {
		type: Number,
		default: 20
	}
})

onMounted(async () => {
	await drawChart()
})

const drawChart = async () => {

	const option = {
		title: {
			text: props.title,
			subtext: props.subtext,
			left: 'center',
			textStyle: {
				fontSize: 26
			}
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			/**
			 * 图例的布局朝向 horizontal / vertical
			 */
			orient: 'vertical',
			/**
			 * 图例的水平位置 left / right
			 */
			left: 'left'
		},
		series: [
			{
				name: props.title,
				type: 'pie',
				/**
				 * 饼图的半径
				 */
				radius: '50%',
				data: await props.func(),
				emphasis: {
					itemStyle: {
						/**
						 * 鼠标悬浮时的阴影大小
						 */
						shadowBlur: 10,
						/**
						 * 鼠标悬浮时的阴影偏移量
						 */
						shadowOffsetX: 0,
						/**
						 * 鼠标悬浮时的阴影颜色
						 */
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	}

	var chartDom = document.getElementById('main')!
	var myChart = echarts.init(chartDom)
	option && myChart.setOption(option)
}
</script>
<style scoped></style>