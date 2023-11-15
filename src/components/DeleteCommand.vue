<!--常用命令操作组件-->

<script setup lang="ts">
import {
	MDBBtn
} from 'mdb-vue-ui-kit'
import * as common from '@/utils/common'

</script>

<template>
	<MDBBtn color="danger" @click="common.deleteBatchAsync()" v-show="common.items.value.findIndex(item => {
    // @ts-ignore
		return item.selected === true
	}) !== -1" class="delete-btn">
		<i class="fas fa-trash"></i>
	</MDBBtn>
</template>

<style scoped>
.delete-btn {
  animation: show-delete-btn 0.3s ease-in-out;
}

@keyframes show-delete-btn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>