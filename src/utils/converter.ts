import moment from "moment"

export function genderConverter(value: any) {
	return value == true ? '男' : '女'
}

export function dateConverter(value: any) {
	return moment(value).format('YYYY-MM-DD HH:mm')
}

export function trueFalseConverter(value: any) {
	return value ? '是' : '否'
}