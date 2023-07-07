<script setup lang="ts">
import { ROUTE_FINANCIAL_STATEMENT_OUTPUT } from '@/utils/constants'
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
					field: 'maintenance_fee',
					label: '保养费用',
					type: 'number',
					isValid: false,
					validator: async (value) => {
					}
				},
				{
					field: 'violate_count',
					label: '违章次数',
					type: 'number',
					isValid: false,
					validator: async (value) => {

					}
				},
				{
					field: 'accident_count',
					label: '事故次数',
					type: 'number',
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
	<DataTable :columns="columns" :base-u-r-l="`${ROUTE_FINANCIAL_STATEMENT_OUTPUT}`" :allow-delete="false"
		:allow-add="false" />
</template>