<!--常用命令操作组件-->

<script setup lang="ts">
import {
	MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from 'mdb-vue-ui-kit'
import { ref } from 'vue'
import * as common from '@/utils/common'

const dropdown = ref(false);

</script>

<template>
	<MDBDropdown class="d-inline-flex" v-model="dropdown">
		<MDBDropdownToggle @click="dropdown = !dropdown">
			更多
		</MDBDropdownToggle>
		<MDBDropdownMenu>
			<MDBDropdownItem href="javascript:void(0);" @click="common.exportToExcel()">导出至 Excel</MDBDropdownItem>
			<MDBDropdownItem href="javascript:void(0);" @click="common.importFromExcel()">从 Excel 导入</MDBDropdownItem>
		</MDBDropdownMenu>
	</MDBDropdown>
</template>