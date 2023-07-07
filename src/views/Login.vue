<script setup lang="ts">
import {
	MDBCard,
	MDBCol,
	MDBCardBody,
	MDBCardTitle,
	MDBRow,
	MDBBtn,
	MDBInput
} from "mdb-vue-ui-kit";
</script>

<script lang="ts">
import { defineComponent } from "vue";
import DataService from '@/services/data-service'
import router from "@/router";
import { setToken } from '@/utils/storage'
import { TOAST_DANGER, TOAST_WARNING } from "@/utils/constants";

const dataService = new DataService()

export default defineComponent({
	data() {
		return {
			user: {
				username: '',
				password: ''
			}
		}
	},
	methods: {
		async login() {
			if (this.user.username === '' || this.user.password === '') {
				this.$emit('launchToast', {
					title: '提示',
					content: '账号或密码不能为空',
					color: TOAST_WARNING
				})
			} else {
				dataService.login(this.user).then(res => {
					const token = res.data.data.token
					if (token) {
						setToken(token)
						router.push({ path: "/" })
					} else {
						this.$emit('launchToast', {
							title: '警告',
							content: '账号或密码错误',
							color: TOAST_DANGER
						})
					}
				});
			}
		}
	}
})
</script>

<template>
	<!--Grid row-->
	<MDBRow class="d-flex animate__animated animate__pulse" center>
		<!--Grid column-->
		<MDBCol md="4">
			<MDBCard text="center" style="margin-top: 40%;">
				<MDBCardBody>
					<MDBCardTitle>汽车租赁平台</MDBCardTitle>
					<MDBInput class="mt-4" label="用户名" v-model="user.username" />
					<MDBInput type="password" class="mt-2" label="密码" v-model="user.password" />
					<MDBBtn class="mt-4" href="#!" color="primary" @click="login()">登录</MDBBtn>
				</MDBCardBody>
			</MDBCard>
		</MDBCol>
		<!--Grid column-->
	</MDBRow>
	<!--Grid row-->
</template>