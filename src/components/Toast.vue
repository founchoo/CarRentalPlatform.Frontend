<!--全局通知组件-->

<template>
	<div class="toast toast-fixed fade" id="toast-container" role="alert" aria-live="assertive"
		aria-atomic="true" data-mdb-autohide="false" data-mdb-position="top-right" data-mdb-append-to-body="true"
		data-mdb-stacking="false" data-mdb-width="350px" data-mdb-color="info"
		style="width: 350px; display: block; top: unset; bottom: 10px; left: 50%; transform: translate(-50%);">
		<div id="toast-title-container" class="toast-header">
			<i id="toast-icon" class="fas fa-lg me-2"></i>
			<strong class="me-auto">{{ title }}</strong>
		</div>
		<div class="toast-body">{{ message }}</div>
	</div>
</template>

<script setup lang="ts">
import { TOAST_DANGER, TOAST_DURATION, TOAST_INFO, TOAST_SUCCESS, TOAST_WARNING } from '@/utils/constants';
import { defineComponent } from 'vue';


</script>

<script lang="ts">
export default defineComponent({
	props: {
		show: {
			type: Boolean,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: true
		},
		level: {
			type: String,
			required: true
		}
	},
	watch: {
		// @ts-ignore
		show(newValue, oldValue) {
			if (newValue) {
				setTimeout(() => {
					document.getElementById('toast-container')?.classList.add('show')
					setTimeout(() => {
						document.getElementById('toast-container')?.classList.remove('show')
					}, TOAST_DURATION - 200)
				}, 100)
			}
		},
		// @ts-ignore
		level(newValue, oldValue) {
			const toast = document.getElementById('toast-container')
			if (toast) {
				toast.classList.remove('toast-info')
				toast.classList.remove('toast-success')
				toast.classList.remove('toast-warning')
				toast.classList.remove('toast-danger')
				toast.classList.add(`toast-${newValue}`)
			}
			const toastHeader = document.getElementById('toast-title-container')
			if (toastHeader) {
				toastHeader.classList.remove('toast-info')
				toastHeader.classList.remove('toast-success')
				toastHeader.classList.remove('toast-warning')
				toastHeader.classList.remove('toast-danger')
				toastHeader.classList.add(`toast-${newValue}`)
			}
			const toastIcon = document.getElementById('toast-icon')
			if (toastIcon) {
				toastIcon.classList.remove('fa-info-circle')
				toastIcon.classList.remove('fa-check')
				toastIcon.classList.remove('fa-exclamation-circle')
				toastIcon.classList.remove('fa-exclamation-triangle')
				if (newValue === TOAST_INFO) {
					toastIcon.classList.add('fa-info-circle')
				} else if (newValue === TOAST_SUCCESS) {
					toastIcon.classList.add('fa-check')
				} else if (newValue === TOAST_WARNING) {
					toastIcon.classList.add('fa-exclamation-triangle')
				} else if (newValue === TOAST_DANGER) {
					toastIcon.classList.add('fa-exclamation-circle')
				}
			}
		}
	}
})
</script>