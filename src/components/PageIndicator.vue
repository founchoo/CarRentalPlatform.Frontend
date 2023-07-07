<!--页面指示器组件-->

<script setup lang="ts">
import { MDBBadge } from 'mdb-vue-ui-kit'
</script>

<script lang="ts">
import * as common from '@/utils/common'
</script>

<template>
	<MDBBadge color="primary" class="text-size: 16px;">
		第 {{ common.currentPageNo }} 页，共 {{ common.totalPageCount }} 页
	</MDBBadge>
</template>