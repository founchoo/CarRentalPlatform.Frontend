<!--常用命令操作组件-->

<script setup lang="ts">
import {
	MDBBtn
} from 'mdb-vue-ui-kit'
import * as common from '@/utils/common'

</script>

<template>
	<MDBBtn color="primary" @click="common.addDataModalRaiseType.value = 'add'; common.data.value = {}; common.beforeAdd.value(); common.showAddDataModal.value = true;">
		<i class="fas fa-plus"></i>
	</MDBBtn>
</template>