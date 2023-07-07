import * as common from '@/utils/common'
import moment from 'moment'

/**
 * 正数验证
 * @param columnField 需要验证的值所属的列属性名
 * @param value 需要验证的值
 */
export function positiveNumber(columnField: string, value, min: number = 0) {
	const col = common.getColumn(columnField)
	col.isValid = /^\d+$/.test(value) && parseInt(value) > min
}

export function notEmpty(columnField: string, value) {
	const col = common.getColumn(columnField)
	col.isValid = value !== null && value !== undefined && value !== ''
}

export function dateTime(columnField: string, value) {
	const col = common.getColumn(columnField)
	col.isValid = moment(value, 'yyyy-MM-DD', true).isValid()
}

/**
 * 正则验证车牌
 * @param str 传入的车牌号
 * @returns 验证通过返回 true, 不通过返回 false
 */
export function licensePlateCheck(columnField: string, value) {
	const col = common.getColumn(columnField)
	col.isValid = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(value)
}

export function idCard(columnField: string, value) {
	const col = common.getColumn(columnField)
	col.isValid = UtilRoles.checkIdCard(value)
}

const UtilRoles = {

	// 身份证校验
	checkIdCard(idCard: string) {

		// areaCode:地区码  checkCode：最后一位的校验码
		const areaCode = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91];
		const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

		if (idCard.length === 15) {               // 如果是15位的身份证号码

			// 判断地区码
			const idCardAreaCode = parseInt(idCard.substr(0, 2));
			if (areaCode.indexOf(idCardAreaCode) === -1) {
				return false;
			}

			// 判断时间
			const borthYear = parseInt(idCard.substr(6, 2)) + 1900;
			const isRunNian = (borthYear % 400 === 0) || (borthYear % 100 !== 0 && borthYear % 4 === 0);
			let regStr = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
			if (isRunNian) {
				regStr = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
			}
			if (!idCard.match(regStr)) {
				return false;
			}

			return true;
		} else if (idCard.length === 18) {        // 如果是18位的身份证号码

			// 判断地区码
			const idCardAreaCode = parseInt(idCard.substr(0, 2));
			if (areaCode.indexOf(idCardAreaCode) === -1) {
				return false;
			}

			// 判断时间
			const borthYear = parseInt(idCard.substr(6, 4));
			const isRunNian = (borthYear % 400 === 0) || (borthYear % 100 !== 0 && borthYear % 4 === 0);
			let regStr = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
			if (isRunNian) {
				regStr = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
			}
			if (!idCard.match(regStr)) {
				return false;
			}

			// 判断最后一位---校验码
			const sumIdCard = (parseInt(idCard.substr(0, 1)) + parseInt(idCard.substr(10, 1))) * 7 +
				(parseInt(idCard.substr(1, 1)) + parseInt(idCard.substr(11, 1))) * 9 +
				(parseInt(idCard.substr(2, 1)) + parseInt(idCard.substr(12, 1))) * 10 +
				(parseInt(idCard.substr(3, 1)) + parseInt(idCard.substr(13, 1))) * 5 +
				(parseInt(idCard.substr(4, 1)) + parseInt(idCard.substr(14, 1))) * 8 +
				(parseInt(idCard.substr(5, 1)) + parseInt(idCard.substr(15, 1))) * 4 +
				(parseInt(idCard.substr(6, 1)) + parseInt(idCard.substr(16, 1))) * 2 +
				parseInt(idCard.substr(7, 1)) * 1 + parseInt(idCard.substr(8, 1)) * 6 +
				parseInt(idCard.substr(9, 1)) * 3;
			const modNum = checkCode[sumIdCard % 11];
			if (modNum !== idCard.substr(17, 1).toUpperCase()) {
				return false;
			}

			return true
		} else {
			return false;
		}

	},

	// 统一社会信用代码校验
	checkSocialUniCode(uniCode: string) {

		// 假如不是18位，错误
		if (uniCode.length !== 18) {
			return false;
		}

		// 统一社会信用代码由18位阿拉伯数字或英文大写字母表示（不包括I,O,Z,S,V以防止和阿拉伯字母混淆）-->V：？？？关我毛事？
		const UpUniCode = uniCode.toUpperCase();
		if (UpUniCode.indexOf("I") !== -1) {
			return false;
		}
		if (UpUniCode.indexOf("O") !== -1) {
			return false;
		}
		if (UpUniCode.indexOf("Z") !== -1) {
			return false;
		}
		if (UpUniCode.indexOf("S") !== -1) {
			return false;
		}
		if (UpUniCode.indexOf("V") !== -1) {
			return false;
		}

		// （组织机构代码）校验
		const orgCheckCode = [
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
			'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		]
		const orgWeight = [3, 7, 9, 10, 5, 8, 4, 2];
		const orgCode = uniCode.substr(8, 9);
		let sumOrg = 0;
		for (let i = 0; i < 8; i++) {
			let tmpAttr = orgCode[i] as any;
			let tmpCode = orgCheckCode.indexOf(tmpAttr);
			let tmpWeight = orgWeight[i]
			sumOrg += (tmpCode * tmpWeight);
		}
		const modOrg = 11 - sumOrg % 11;
		const modOrgLast = (modOrg === 10) ? "X" : ((modOrg === 11) ? "0" : ("" + modOrg));
		if (modOrgLast !== orgCode[8]) {
			return false;
		}

		// 最后一位的校验
		const uniCheckCode = [
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q',
			'R', 'T', 'U', 'W', 'X', 'Y'
		]
		const uniCodeWeight = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
		let sumUniCode = 0;
		for (let i = 0; i < 17; i++) {
			let tmpAttr = uniCode[i] as any;
			let tmpCode = uniCheckCode.indexOf(tmpAttr);
			let tmpWeight = uniCodeWeight[i];
			sumUniCode += (tmpCode * tmpWeight);
		}
		const modOrgUni = 31 - sumUniCode % 31;
		const modOrgUniLast = orgCheckCode[modOrgUni];
		if (modOrgUniLast !== uniCode[17]) {
			return false;
		}




		return true;
	}

}


// 将传入的姓名中空格和全角空格都去掉，乱七八糟的·都换成半角的·
export const checkChineseName = function (name) {
	let reg = /^[\u4e00-\u9fa5]{2,15}$/;
	// 保留点后,用来校验的姓名,也是最终校验通过后返回的姓名
	let payerName = name.replaceAll("　", "")
		.replaceAll(" ", "")
		.replaceAll("•", "·")
		.replaceAll("．", "·");
	// 去除所有点后，用来校验的姓名
	let checkName = name.replaceAll("　", "")
		.replaceAll(" ", "")
		.replaceAll("•", "")
		.replaceAll("．", "")
		.replaceAll("·", "");
	if (checkName.length === 1) {
		console.error("姓名至少包含两位汉字，请修正");
		return false;
	}
	if (reg.test(checkName)) {
		if (payerName.substring(0, 1) === '·') {
			console.error("姓名第一位不能为【·】，请修正");
			return false;
		}
		if (payerName.substring(payerName.length - 1) === '·') {
			console.error("姓名最后不能为【·】，请修正");
			return false;
		}
		if (payerName.indexOf("··") !== -1) {
			console.error("姓名不能有连续的【·】，请修正");
			return false;
		}
		return payerName;
	} else {
		console.error("姓名中只能包含【汉字】和【·】，请修正");
		return false;
	}
}


/**
 * 字符串的相关操作
 */
export class StringUtils {
	public static isPhone(phone: string) {
		//通过正则表达式判断手机号码格式是否正确,根据电信，联通、移动手机号码规则可以到以下正则
		// 手机号码第一位是[1]开头，第二位[3,4,5,7,8]中的一位，第三位到第十一位则是[0-9]中的数字；
		//^1表示开头为1
		//[3|4|5|7|8] 表示3、4、5、7、8中的一位数值
		//[0-9]{9} 匹配包含0-9的数字
		let reg = /^1[3|4|5|7|8][0-9]{9}/;
		if (reg.test(phone)) {
			return true;//手机号码正确
		}

		return false;
	}
}