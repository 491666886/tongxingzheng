import { instance as axios } from './index'

export function getTimeLine(data){
	return axios({
		url: '/class/schedule/list',
		method: 'post',
		data
	})
}
export function addTimeline(data){
	return axios({
		url: '/class/schedule/save',
		method: 'post',
		data
	})
}
export function editTimeline(data){
	return axios({
		url: '/class/schedule/update',
		method: 'post',
		data
	})
}
export function checkExpired(data) {
	return axios({
		url: '/class/schedule/validity',
		method: 'post',
		data
	})
}
