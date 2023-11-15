<script setup lang="ts">
import {
	MDBCard, MDBCardBody, MDBCardText, MDBBtn, MDBCol, MDBCardLink,
	MDBRow, MDBCheckbox, MDBListGroup, MDBListGroupItem, MDBCardTitle
} from 'mdb-vue-ui-kit'
import Search from '@/components/Search.vue'
import PageIndicator from '@/components/PageIndicator.vue';
import PageNavigator from '@/components/PageNavigator.vue';
import AddCommand from './AddCommand.vue';
import DeleteCommand from './DeleteCommand.vue';
import ExcelCommand from './ExcelCommand.vue';
import * as common from '@/utils/common'

</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { copyToClipboard } from '@/utils/common';
import { TOAST_SUCCESS } from '@/utils/constants';
import * as messenger from '@/utils/messenger'

export default defineComponent({
	props: {
		// Table headers, columns is a list of column,
		// which has two properties: `field` for machine to identify and `label` for user to read
		columns: {
			type: Array,
			required: true,
		},
		// Used to construct a full URL. e.g. `http://127.0.0.1:8080/${baseURL}/getAll`
		baseURL: {
			type: String,
			required: true
		},
		/**
		 * 指示是否支持新增操作
		 */
		allowAdd: {
			type: Boolean,
			default: true
		},
		allowDelete: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			showDetail: false,
		}
	},
	mounted() {
		common.columns.value = this.columns
		common.pageSize.value = 6
		common.setBaseURL(this.baseURL)
		// Init data
		common.getAllByPageAsync()
	},
	methods: {
		// @ts-ignore
		copyID(item, field, label) {
      console.log(item, field, label)
      if (label === '客户 ID') {
        messenger.cid.value = item[field]
      } else {
        messenger.vid.value = item[field]
      }
      copyToClipboard(item[field]);
      this.$emit('launchToast', {
        title: '提示',
        content: '已复制ID',
        color: TOAST_SUCCESS
      })
    }
	}
});
</script>

<template>
	<div v-show="!showDetail" class="animate__animated animate__fadeIn">

		<!-- 卡片组数据 -->
		<MDBRow class="ms-0" style="margin-top: 8vh;">
			<MDBCol class="p-0" md="4" v-for="item in common.items.value" :key="// @ts-ignore
			item.id">
				<MDBCard style="margin-right: 10px; margin-bottom: 15px;" class="p-0">
					<div class="rounded-5"
						:style="// @ts-ignore
						'width: auto; height: 200px; background-image: url(' + item.img + '); background-repeat: no-repeat; background-size: cover; background-position: center;'">
					</div>
					<MDBCheckbox v-model="// @ts-ignore
					item.selected" class="position-absolute" style="top: 1vh; right: 1vh;" />
					<MDBCardBody>
						<MDBListGroup light small>
							<MDBListGroupItem noBorder v-for="column in columns"
								v-show="// @ts-ignore
								column.showOnSummary === undefined || column.showOnSummary === true">
								<strong>
									{{ // @ts-ignore
									column.label }}:
								</strong>
								<span>
									<span v-if="// @ts-ignore
									column.converter !== undefined">
										{{ // @ts-ignore
										column.converter(item[column.field]) }}
									</span>
									<span v-else-if="// @ts-ignore
									column.type === 'uuid'">
										<MDBBtn color="link" @click="// @ts-ignore
										copyID(item, column.field, column.label)">
											<i class="fas fa-copy"></i>
										</MDBBtn>
									</span>
									<span v-else>
										{{ // @ts-ignore
										item[column.field] }}
									</span>
								</span>
							</MDBListGroupItem>
						</MDBListGroup>
						<!-- <MDBCardLink href="javascript:void(0);" @click="common.editBtnClicked(item)" color="link">编辑</MDBCardLink> -->
						<MDBCardLink href="javascript:void(0);" color="link" @click="common.data.value = item; showDetail = true">查看更多
						</MDBCardLink>
						<MDBCardLink v-show="allowDelete" href="javascript:void(0);" @click="common.deleteAsync(item)" color="link"
							class="text-danger">删除
						</MDBCardLink>
					</MDBCardBody>
				</MDBCard>
			</MDBCol>
		</MDBRow>

		<div
			style="position: fixed; top: 0; left: 15%; right: 8vh; margin-top: 10vh; background-color: rgba(255, 255, 255, 0.87); height: 10vh;">
		</div>

		<!-- 顶部固定操作栏 -->
		<div style="position: fixed; top: 0; left: 17%; right: 8vh; margin-top: 12vh;">
			<div class="d-flex flex-row justify-content-between">
				<div class="d-flex flex-row justify-content-between">
					<AddCommand v-show="allowAdd" />
					<div v-show="allowDelete">
						<DeleteCommand />
					</div>
					<ExcelCommand />
				</div>

				<Search />
				<!-- 翻页 -->
				<div class="d-flex justify-content-end align-items-center">
					<div>
						<PageNavigator />
					</div>
					<div>
						<PageIndicator />
					</div>
				</div>
			</div>

		</div>

	</div>


	<!-- 卡片详情（展开） -->
	<MDBCard v-show="showDetail" class="mb-3 animate__animated animate__fadeIn p-0	" style="max-width: 100%">
		<MDBRow class="g-0">
			<MDBCol md="4">
				<div v-show="// @ts-ignore
				common.data.value.img !== undefined" class="rounded-5"
					:style="// @ts-ignore
					'width: 100%; height: 100%; background-image: url(' + common.data.value.img + '); background-repeat: no-repeat; background-size: cover; background-position: center;'">
				</div>
			</MDBCol>
			<MDBCol md="8">
				<MDBCardBody>
					<MDBCardTitle class="custom-card-title">车辆详情</MDBCardTitle>
					<MDBCardText class="custom-card-text">
					</MDBCardText>
				</MDBCardBody>
				<MDBListGroup flush>
					<MDBListGroupItem noBorder v-for="column in columns">
						<strong>
							{{ // @ts-ignore
							column.label }}:
						</strong>
						<span>
							<span v-if="// @ts-ignore
							column.converter !== undefined">
								{{ // @ts-ignore
								column.converter(common.data.value[column.field]) }}
							</span>
							<span v-else-if="// @ts-ignore
							column.type === 'uuid'">
								<MDBBtn color="link" @click="// @ts-ignore
								copyID(common.data.value, column.field, column.label)">
									<i class="fas fa-copy"></i>
								</MDBBtn>
							</span>
							<span v-else>
								{{ // @ts-ignore
								common.data.value[column.field] }}
							</span>
						</span>
					</MDBListGroupItem>
				</MDBListGroup>
				<MDBCardBody>
					<MDBCardLink href="javascript:void(0);" color="link" @click="showDetail = false">返回</MDBCardLink>
					<MDBCardLink href="javascript:void(0);" @click="common.editBtnClicked(common.data.value)" color="link">编辑</MDBCardLink>
				</MDBCardBody>

			</MDBCol>
		</MDBRow>
	</MDBCard>
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

.custom-card-title {
	/* font-family: "Your Custom Font", sans-serif; */
	font-size: 50px;
	/* font-weight: bold; */
	/* color: #333; 修改字体颜色 */
	/* 添加其他样式属性，如文字阴影、文字对齐等 */
}

.custom-card-text {
	font-size: 10px;
	/* font-style: italic; */
}

/* 滑块样式 */
.range {
	position: relative;
}

.thumb2 {
	position: absolute;
	top: 0;
	left: 0;
	transform: translateX(-50%);
	width: 10px;
	height: 20px;
	background-color: #ccc;
	border-radius: 4px;
}

.thumb-value2 {
	position: absolute;
	top: -25px;
	left: 0;
}

#customRange2 {
	margin-top: 30px;
}

/* 滑块样式 */
</style>
