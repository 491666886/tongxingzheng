import { instance as axios } from './index'

export function getList(data){
	return axios({
		url: '/class/list',
		method: 'post',
		data
	})
}
export function addClass(data){
	return axios({
		url: '/class/save',
		method: 'post',
		data
	})
}
export function editClass(data){
	return axios({
		url: '/class/update',
		method: 'post',
		data
	})
}
export function deleteClass(data){
	return axios({
		url: '/class/delete',
		method: 'post',
		data
	})
}
export function queryClass(data){
	return axios({
		url: '/class/get',
		method: 'post',
		data
	})
}
export function getAllRooms(data) {
	return axios({
		url: '/class/room/list',
		method: 'post',
		data
	})
}
export function getMonitorStreams(params) {
	return axios({
		url: '/monitor/streams',
		method: 'get',
		params
	})
}