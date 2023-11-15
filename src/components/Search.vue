<!--搜索组件-->

<script setup lang="ts">
import {
	MDBInput, MDBBtn,
	MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
	MDBCard, MDBCardBody, MDBRadio
} from 'mdb-vue-ui-kit'
// @ts-ignore
import { defineComponent, ref } from 'vue'

</script>

<script lang="ts">
import * as common from '@/utils/common'

export default defineComponent({
	data() {
		return {
			filterDropdown: false,
			fieldDropdown: false,
			/**
			 * 筛选目标列
			 */
			filterColumnField: '',
			filterColumnLabel: '',
			filterColumnType: '',
			/**
			 * 区间筛选起始值
			 */
			filterMinValue: '',
			/**
			 * 区间筛选结束值
			 */
			filterMaxValue: '',
			/**
			 * 等值筛选目标值
			 */
			filterEqValue: ''
		}
	},
	methods: {
		submit() {
			if (this.filterEqValue === '') {
				common.filterRangeByPageAsync(this.filterMinValue, this.filterMaxValue, this.filterColumnField)
			} else {
				common.fuzzySearchByColumnByPageAsync(this.filterEqValue, this.filterColumnField)
			}
		}
	}
})
</script>

<template>
	<div class="d-flex flex-row" style="width: 40%;">
		<MDBInput @keyup="common.fuzzySearchByPageAsync()" v-model="common.keyword.value" inputGroup :formOutline="false"
			placeholder="搜索">
		</MDBInput>

		<MDBDropdown class="ms-1" v-model="filterDropdown">
			<MDBDropdownToggle @click="filterDropdown = !filterDropdown">
				高级搜索
			</MDBDropdownToggle>
			<MDBDropdownMenu>
				<MDBCard class="p-0">
					<MDBCardBody>
						<h6>目标属性</h6>
						<div class="d-flex flex-row">
							<MDBInput v-model="filterColumnLabel" disabled placeholder="选择属性"></MDBInput>
							<MDBDropdown v-model="fieldDropdown" color="primary" class="text-center">
								<MDBDropdownToggle @click="fieldDropdown = !fieldDropdown">
								</MDBDropdownToggle>
								<MDBDropdownMenu>
									<MDBDropdownItem
										v-show="// @ts-ignore
										column.type === 'number' || column.type === 'date' || column.type === 'boolean'"
										@click="// @ts-ignore
										filterColumnField = column.field; filterColumnLabel = column.label; filterColumnType = column.type"
										v-for="column in common.columns.value" href="javascript:void(0);">
										{{ // @ts-ignore
										column.label }}
									</MDBDropdownItem>
								</MDBDropdownMenu>
							</MDBDropdown>
						</div>

						<div v-if="filterColumnType !== 'boolean'">
							<h6 class="mt-4">区间筛选</h6>
							<div class="d-flex flex-row mt-3">
								<MDBInput :type="filterColumnType" :disabled="filterEqValue != ''" label="起始值" v-model="filterMinValue"
									style="width: 150px;" />
								<span class="mt-2 mx-2">—</span>
								<MDBInput :type="filterColumnType" :disabled="filterEqValue != ''" label="结束值" v-model="filterMaxValue"
									style="width: 150px;" />
							</div>
						</div>
						<div style="width: 327px;" v-else>

						</div>

						<h6 class="mt-4">等值筛选</h6>
						<div class="d-flex flex-row mt-3">

							<div v-if="filterColumnType === 'boolean'">
								<MDBRadio label="是" value="1" v-model="filterEqValue" inline />
								<MDBRadio label="否" value="0" v-model="filterEqValue" inline />
							</div>
							<div v-else>
								<MDBInput :type="filterColumnType" :disabled="filterMinValue != '' || filterMaxValue != ''" label="目标值"
									v-model="filterEqValue" />
							</div>

						</div>
						<div class="d-flex mt-3 justify-content-end">
							<MDBBtn color="secondary"
								@click="filterColumnLabel = ''; filterColumnField = ''; filterColumnType = ''; filterMinValue = '', filterMaxValue = ''; common.getAllByPageAsync()">
								清除筛选
							</MDBBtn>
							<MDBBtn color="primary" :disabled="// @ts-ignore
							this.filterColumnField === '' ||
							// @ts-ignore
								(this.filterMinValue === '' && this.filterMaxValue === '' && this.filterEqValue === '')" @click="submit()">确定
							</MDBBtn>
						</div>
					</MDBCardBody>
				</MDBCard>
			</MDBDropdownMenu>
		</MDBDropdown>
	</div>
</template>

<style scoped>
.select-arrow {
	color: var(--mdb-form-outline-select-arrow-color);
	text-align: center;
	font-size: var(--mdb-form-outline-select-arrow-font-size);
	position: absolute;
	top: var(--mdb-form-outline-select-arrow-top);
	right: var(--mdb-form-outline-select-arrow-right);
}

.form-outline .form-control~.form-notch {
	display: flex;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	max-width: 100%;
	height: 100%;
	text-align: left;
	pointer-events: none;
}

select.select-initialized {
	display: none !important;
}

.form-outline {
	position: relative;
	width: 100%;
}

.select-wrapper {
	--mdb-form-outline-select-arrow-color: #000;
	--mdb-form-outline-select-arrow-font-size: 16px;
	--mdb-form-outline-select-arrow-top: 7px;
	--mdb-form-outline-select-arrow-right: 16px;
	--mdb-form-outline-select-valid-color: #00b74a;
	--mdb-form-outline-select-invalid-color: #f93154;
	--mdb-form-outline-select-clear-btn-color: #000;
	--mdb-form-outline-select-clear-btn-font-size: 1rem;
	--mdb-form-outline-select-clear-btn-top: 7px;
	--mdb-form-outline-select-clear-btn-right: 27px;
	--mdb-form-outline-select-clear-btn-focus-color: #3b71ca;
	--mdb-form-outline-select-sm-clear-btn-font-size: 0.8rem;
	--mdb-form-outline-select-sm-clear-btn-top: 4px;
	--mdb-form-outline-select-lg-clear-btn-top: 11px;
	--mdb-form-outline-select-label-max-width: 80%;
	--mdb-form-outline-select-label-active-transform: translateY(-1rem) translateY(0.1rem) scale(0.8);
	--mdb-form-outline-select-lg-label-active-transform: translateY(-1.25rem) translateY(0.1rem) scale(0.8);
	--mdb-form-outline-select-sm-label-active-transform: translateY(-0.83rem) translateY(0.1rem) scale(0.8);
	--mdb-form-outline-select-input-focused-color: #616161;
	--mdb-form-outline-select-label-color: #3b71ca;
	--mdb-form-outline-select-notch-border-color: #3b71ca;
	--mdb-form-outline-select-input-focused-arrow-color: #3b71ca;
	--mdb-form-outline-select-white-focus-arrow-color: #fff;
	--mdb-form-outline-select-white-arrow-color: #fff;
	--mdb-form-outline-select-white-clear-btn: #fff;
	--mdb-form-outline-select-sm-arrow-top: 3px;
	--mdb-form-outline-select-lg-arrow-top: 11px;
	--mdb-form-outline-form-notch-border-top: 1px solid transparent;
}
</style>