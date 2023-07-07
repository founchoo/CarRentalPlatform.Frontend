<script setup lang="ts">
import { ROUTE_FINANCIAL_STATEMENT_INCOME } from '@/utils/constants'
import DataTable from '@/components/DataTable.vue'
import * as common from '@/utils/common'
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {
			columns: [
				{
					field: 'id',
					label: '车辆 ID',
					type: 'uuid',
					isValid: false,
					validator: async (value) => {

					}
				},
				{
					field: 'manufacturer',
					label: '厂商',
					isValid: false,
					validator: async (value) => {

					}
				},
				{
					field: 'brand',
					label: '品牌',
					isValid: false,
					validator: async (value) => {

					}
				},
				{
					field: 'total_distance',
					label: '总里程',
					type: 'number',
					isValid: false,
					validator: async (value) => {

					}
				},
				{
					field: 'total_rental_fee',
					label: '租金',
					type: 'number',
					isValid: false,
					validator: async (value) => {
					}
				},
				{
					field: 'rent_date',
					label: '出租时间',
					type: 'date',
					isValid: false,
					validator: async (value) => {

					}
				},
			],
		};
	},
	created() {
		common.beforeAdd.value = () => {
		}
		common.afterAdd.value = () => {
		}
	}
});
</script>

<template>
	<DataTable :columns="columns" :base-u-r-l="`${ROUTE_FINANCIAL_STATEMENT_INCOME}`" :allow-delete="false"
		:allow-add="false" />
</template>