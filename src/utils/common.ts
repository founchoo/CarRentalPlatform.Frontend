import DataService from "@/services/data-service"
import { ref, watch } from "vue"

const dataService = new DataService()

// From which index (begin with 1) should the database start to read
export let currentPageNo = ref(1)
export let totalPageCount = ref(0)
// For how many items be shown per page
export let pageSize = ref()
// Search keyword
export let keyword = ref("")
export let data = ref({})
// To store the ids that user select
export let ids = ref({})
// Show add data dialog
export let showAddDataModal = ref(false)
export let allItemSelected = ref(false)
export let items = ref([])
export let searchColumn = ref({})

export let columns = ref({})

/**
 * 新增/修改窗口唤起类型
 */
export let addDataModalRaiseType = ref('add')

/**
 * 用于新增数据窗口显示前的一些操作，
 * 一般为自动生成一些数据，
 * 例如：生成一个随机的ID
 */
export let beforeAdd = ref(Function)

/**
 * 用于新增数据窗口成功提交后的一些操作
 */
export let afterAdd = ref(Function)

export let sort = ref({
	column: '',
	asc: true
})

/**
 * 设置当前访问的数据的属性值，
 * 该方法将同时设置对应的属性的验证状态为 true
 * @param field 属性
 * @param value 值
 */
export function setDataValue(field: string, value) {
	data.value[field] = value
	if (value === '') {
		getColumn(field).isValid = false
	} else {
		getColumn(field).isValid = true
	}
}

/**
 * 关闭新增/修改弹窗时触发的事件
 */
export function onCloseModal() {
	showAddDataModal.value = false
	for (let i = 0; i < columns.value.length; i++) {
		let column = columns.value[i]
		column.isValid = false
	}
}

watch(showAddDataModal, (newValue) => {
	if (!newValue) {
		onCloseModal()
	}
})

/**
 * 修改按钮点按时触发的事件
 * @param item 传递的数据
 */
export function editBtnClicked(item) {
	addDataModalRaiseType.value = 'edit'
	beforeEdit()
	console.log(item)
	data.value = item
	showAddDataModal.value = true
}

/**
 * 点按修改按钮前做的准备
 */
export function beforeEdit() {
	for (let i = 0; i < columns.value.length; i++) {
		let column = columns.value[i]
		column.isValid = true
	}
}

export function getColumn(field: string) {
	return columns.value.find((obj) => {
		return obj.field === field
	})
}

export function init() {
	currentPageNo.value = 0
	totalPageCount.value = 0
	pageSize.value = 0
	keyword.value = ""
	data.value = {}
	ids.value = {}
	showAddDataModal.value = false
	allItemSelected.value = false
	items.value = []
	columns.value = {}
	sort.value = {
		column: '',
		asc: true
	}
}

export function setBaseURL(url: string) {
	dataService.setBaseURL(url)
}

export function handlePageResponse(response: any) {
	items.value = response.data.data.page.records
	totalPageCount.value = response.data.data.page.pages
}

export function handleError(e) {
	console.log(e)
}

/**
 * 根据ID获取一项数据
 * @param id 目标ID
 */
export async function getByIdAsync(id: string) {
	await dataService.getByIdAsync(id).then(response => {
		return response.data.data
	})
}

export async function getAllByPageAsync() {
	await dataService.getAllByPageAsync(currentPageNo.value, pageSize.value).then(handlePageResponse).catch(handleError)
}

export async function getAllSortedByPageAsync() {
	await dataService.getAllSortedByPageAsync(currentPageNo.value, pageSize.value, sort.value.column, sort.value.asc).then(handlePageResponse).catch(handleError)
}

export async function fuzzySearchByPageAsync() {
	await dataService.fuzzySearchByPageAsync(currentPageNo.value, pageSize.value, keyword.value).then(handlePageResponse).catch(handleError)
}

export async function fuzzySearchByColumnByPageAsync(val: any, column: string) {
	await dataService.fuzzySearchByColumnByPageAsync(currentPageNo.value, pageSize.value, val, column).then(handlePageResponse).catch(handleError)
}

export async function filterRangeByPageAsync(min: any, max: any, column: string) {
	await dataService.filterRangeByPageAsync(currentPageNo.value, pageSize.value, min, max, column).then(handlePageResponse).catch(handleError)
}

export async function addAsync() {
	await dataService.addAsync(data.value).then(handlePageResponse).catch(handleError)
	currentPageNo.value = 1
	await getAllByPageAsync()
}

export async function updateAsync() {
	await dataService.updateAsync(data.value).then(handlePageResponse).catch(handleError)
	currentPageNo.value = 1
	await getAllByPageAsync()
}

export async function deleteAsync(item: any) {
	await dataService.deleteAsync(item.id).then(handlePageResponse).catch(handleError)
	currentPageNo.value = 1
	await getAllByPageAsync()
}

export async function deleteBatchAsync() {
	let ids = []
	for (let i = 0; i < items.value.length; i++) {
		const item: any = items.value[i]
		if (item.selected) {
			ids.push(item.id)
		}
	}
	await dataService.deleteBatchAsync(ids).then(handlePageResponse).catch(handleError);
	currentPageNo.value = 1
	await getAllByPageAsync()
}

export async function exportToExcel() {
	await dataService.exportToExcel().then(response => {
		let a = document.createElement('a');
		let blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
		let objectUrl = URL.createObjectURL(blob);
		a.setAttribute("href", objectUrl);
		a.setAttribute("download", 'excel.xlsx');
		a.click()
	})
}

export async function importFromExcel() {
	let input = document.createElement('input')
	input.type = 'file'
	input.accept = '.xlsx'
	input.onchange = async (e) => {
		let formData = new FormData()
		formData.append('file', e.target.files[0])
		await dataService.importFromExcel(formData)
		currentPageNo.value = 1
		await getAllByPageAsync()
	}
	input.click()
}

/**
 * 翻页，加载下一页
 */
export async function nextPage() {
	currentPageNo.value += 1
	// Refresh data
	await getAllByPageAsync();
}

/**
 * 翻页，加载上一页
 */
export async function previousPage() {
	currentPageNo.value -= 1
	await getAllByPageAsync()
}

/**
 * 更改项目的选择状态，勾选/取消勾选复选框时触发
 * @param item 当前触发此事件的目标对象元素
 * @returns 无
 */
export function changeSelectionStatus(item: any) {
	item.selected = !item.selected
	for (let i = 0; i < items.value.length; i++) {
		const item = items.value[i]
		if (!item.selected) {
			allItemSelected.value = false
			return
		}
	}
	allItemSelected.value = true
}

/**
 * 勾选表头的复选框时触发，一键更改所有项目的勾选状态
 */
export function changeAllSelectionStatus() {
	for (let i = 0; i < items.value.length; i++) {
		const item = items.value[i]
		item.selected = !allItemSelected.value
	}
}

/**
 * 弹出的新增/修改窗口点击保存时触发
 */
export async function submit() {
	if (addDataModalRaiseType.value === 'add') {
		await addAsync()
		afterAdd.value()
	}
	else {
		await updateAsync();
	}
	showAddDataModal.value = false
	for (let i = 0; i < columns.value.length; i++) {
		const item = columns.value[i]
		item.isValid = false
	}
}

/**
 * 点击表头的浮动排序图标时触发
 * @param columns 表头列
 * @param column 当前引起此事件的目标表头
 */
export async function changeSort(columns: [], column: any) {
	for (let i = 0; i < columns.length; i++) {
		if (columns[i].field !== column.field) {
			columns[i].selectionStatus = undefined
		}
	}
	if (column.selectionStatus === undefined) {
		column.selectionStatus = 'asc'
		sort.value.asc = true
		sort.value.column = column.field
		await getAllSortedByPageAsync()
	} else if (column.selectionStatus === 'asc') {
		column.selectionStatus = 'desc'
		sort.value.asc = false
		sort.value.column = column.field
		await getAllSortedByPageAsync()
	} else {
		column.selectionStatus = undefined
		sort.value.asc = true
		sort.value.column = ''
		await getAllByPageAsync()
	}
}

export async function copyToClipboard(textToCopy) {
	// Navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(textToCopy);
	} else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement("textarea");
		textArea.value = textToCopy;

		// Move textarea out of the viewport so it's not visible
		textArea.style.position = "absolute";
		textArea.style.left = "-999999px";

		document.body.prepend(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
		} catch (error) {
			console.error(error);
		} finally {
			textArea.remove();
		}
	};
}