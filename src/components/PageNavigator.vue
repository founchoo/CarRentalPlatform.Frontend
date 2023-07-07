<!--页面导航组件-->

<script setup lang="ts">
import { MDBBtn, MDBIcon } from 'mdb-vue-ui-kit'
</script>

<script lang="ts">
import * as common from '@/utils/common'
</script>

<template>
	<MDBBtn @click="common.previousPage()" color="link" :disabled="common.currentPageNo.value <= 1">
		<MDBIcon icon="angle-left"></MDBIcon>
	</MDBBtn>
	<MDBBtn @click="common.nextPage()" color="link" :disabled="common.currentPageNo.value === common.totalPageCount.value">
		<MDBIcon icon="angle-right"></MDBIcon>
	</MDBBtn>
</template>