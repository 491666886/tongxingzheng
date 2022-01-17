import { instance as axios, instance_res as axioRes } from './index'

export function getList(data){
	return axios({
		url: '/student/getStudentListPage',
		method: 'post',
		data
	})
}
export function addStudent(data){
	return axios({
		url: '/student/createNewChild',
		method: 'post',
		data
	})
}
export function editStudent(data){
	return axios({
		url: '/student/updateChild',
		method: 'post',
		data
	})
}
export function deleteStudent(data){
	return axios({
		url: '/student/deleteChild',
		method: 'post',
		data
	})
}
export function queryStudentInfo(params){
	return axios({
		url: '/student/getChildrenInfo',
		method: 'get',
		params
	})
}
export function checkParentPhoneNum(data) {
	return axios({
		url: '/student/check/phone',
		method: 'post',
		data
	})
}

export function monitorAuthority(data){
	return axioRes({
		url:'/student/child/monitor',
		method:'put',
		data
	})
}

export function highlightMonitorAuthority(data){
	return axioRes({
		url:'/student/child/highlight',
		method:'put',
		data
	})
}