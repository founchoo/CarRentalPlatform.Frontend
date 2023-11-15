<template>
	<div class="mb-2"> <!-- margin-bottom: 4rem; -->
		<MDBBtnGroup>
			<MDBBtn color="primary" @click="type = 'energy'">出租车辆能源类型占比</MDBBtn>
			<MDBBtn color="primary" @click="type = 'accident'">事故简报</MDBBtn>
			<MDBBtn color="primary" @click="type = 'financial'">收入简报</MDBBtn>
		</MDBBtnGroup>
	</div>
	<PieChart v-if="type === 'energy'" :func="getEnergyTypeAsPieChart" title="能源类型" />
	<PieChart v-else-if="type === 'accident'" :func="getTrafficViolateAsPieChart" title="事故简报" />
	<div v-else-if="type === 'financial'">
		<div class="d-flex flex-row justify-content-end align-items-center">
			<MDBBtn color="link" @click="lastYear">
				<MDBIcon icon="angle-left"></MDBIcon>
			</MDBBtn>
			<span class="text-primary">{{ currentYear }} 年</span>
			<MDBBtn color="link" @click="nextYear">
				<MDBIcon icon="angle-right"></MDBIcon>
			</MDBBtn>
		</div>
		<MultifoldChart title="收入简报" :x-axis-data="xAxisData" :get-legend-data="getLegendData"
			:func="getFinancialStatementAsLineChart" />
	</div>
</template>

<script setup lang="ts">
import PieChart from '@/components/PieChart.vue'
import MultifoldChart from '@/components/MultifoldChart.vue'
import DataService from '@/services/data-service'
import { ROUTE_ORDER, ROUTE_TRAFFIC_VIOLATION_ACCIDENT, ROUTE_VEHICLE_INFO } from '@/utils/constants'
import { MDBBtn, MDBBtnGroup, MDBIcon } from 'mdb-vue-ui-kit'
import { ref } from 'vue';

let type = ref('energy')

let currentYear = ref(2022)

/**
 * 能源类型饼状图显示
 */
let getEnergyTypeAsPieChart = async () => {
	let newCount = 0
	let oldCount = 0
	await new DataService(`${ROUTE_VEHICLE_INFO}`).getAllAsync().then(response => {
		const list = response.data.data.list
		for (let i = 0; i < list.length; i++) {
			let item = list[i]
			if (item.energy_type) {
				newCount++
			} else {
				oldCount++
			}
		}
	})
	return [
		{ value: newCount, name: '新能源' },
		{ value: oldCount, name: '传统能源' }
	]
}

/**
 * 事故简报饼状图显示
 */
let getTrafficViolateAsPieChart = async () => {
	let noMistakenCount = 0
	let accidentCount = 0
	let violateCount = 0
	await new DataService(`${ROUTE_ORDER}`).getAllAsync().then(async response => {
		const orderList = response.data.data.list
		await new DataService(`${ROUTE_TRAFFIC_VIOLATION_ACCIDENT}`).getAllAsync().then(response => {
			const violateList = response.data.data.list
			for (let j = 0; j < orderList.length; j++) {
				const order = orderList[j]
				console.log(order)
				if (order.accident === false && order.break_rule === false) {
					noMistakenCount++
				}
			}
			for (let i = 0; i < violateList.length; i++) {
				let violate = violateList[i]
				accidentCount += violate.accident_count
				violateCount += violate.violate_count
			}
		})
	})

	return [
		{ value: noMistakenCount, name: '无过失' },
		{ value: accidentCount, name: '事故' },
		{ value: violateCount, name: '违章' },
	]
}

let xAxisData = () => {
	let data = new Array()
	for (let i = 1; i <= 12; i++) {
		data.push(`${i}月`)
	}
	return data
}

let legendData = new Array()

let getFinancialStatementAsLineChart = async () => {
	let lines = new Array()

	for (let i = 0; i < legendData.length; i++) {
		const brand = legendData[i]
		lines.push({
			name: brand,
			type: 'line',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		})
	}

	// 获取所有订单
	await new DataService(`${ROUTE_ORDER}`).getAllAsync().then(async response => {
		let orderList = response.data.data.list
		await new DataService(`${ROUTE_VEHICLE_INFO}`).getAllAsync().then(async response => {
			let vehicleInfoList = response.data.data.list
			// 按订单遍历
			for (let j = 0; j < orderList.length; j++) {
				const order = orderList[j]
				const vehicleId = order.vid
				for (let k = 0; k < vehicleInfoList.length; k++) {
					if (vehicleInfoList[k].id === vehicleId) {
						const vehicleInfo = vehicleInfoList[k]
						// 遍历折线
						lines.forEach((line) => {
							if (line.name === vehicleInfo.brand) {
								// 获取订单起租时间所在月份
								let month = new Date(order.rent_date).getMonth()
								console.log(order.rent_date)
								console.log(month + 1)
								let year = new Date(order.rent_date).getFullYear()
								console.log(year)
								console.log("--------------------------------")
								if (year === currentYear.value) {
									line.data[month] += order.total_rental_fee
								}
							}
						})
					}
				}
			}
		})
	})
	return lines
}

let getLegendData = async () => {
	let map = new Map()
	await new DataService(`${ROUTE_VEHICLE_INFO}`).getAllAsync().then(async response => {
		let vehicleInfoList = response.data.data.list
		for (let i = 0; i < vehicleInfoList.length; i++) {
			const vehicleInfo = vehicleInfoList[i]
			if (map.has(vehicleInfo.brand)) {
				map.set(vehicleInfo.brand, map.get(vehicleInfo.brand) + 1)
			} else {
				map.set(vehicleInfo.brand, 1)
			}
		}
		var arrayObj = Array.from(map)
		arrayObj.sort(function (a, b) { return b[1] - a[1] })
		for (let i = 0; i < arrayObj.length; i++) {
			const element = arrayObj[i]
			legendData.push(element[0])
		}
	})
	return legendData
}

function lastYear() {
	currentYear.value--
	type.value = ''
	setTimeout(() => { type.value = 'financial' }, 100)
}

function nextYear() {
	currentYear.value++
	type.value = ''
	setTimeout(() => { type.value = 'financial' }, 100)
}

</script>