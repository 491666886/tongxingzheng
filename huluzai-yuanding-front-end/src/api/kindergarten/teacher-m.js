import { instance as axios } from './index'

export function getList(data){
	return axios({
		url: '/teacher/list',
		method: 'post',
		data
	})
}
export function getALLNames(data){
	return axios({
		url: '/teacher/name/list',
		method: 'post',
		data
	})
}
export function addTeacher(data) {
	return axios({
		url: '/teacher/save',
		method: 'post',
		data
	})
}
export function deleteTeacher(data) {
	return axios({
		url: '/teacher/delete',
		method: 'post',
		data
	})
}
export function editTeacher(data) {
	return axios({
		url: '/teacher/update',
		method: 'post',
		data
	})
}
export function getTeacher(data) {
	return axios({
		url: '/teacher/get',
		method: 'post',
		data
	})
}
