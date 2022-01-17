import { instance as axios } from './index'

export function getVideoList(data){
	return axios({
		url: '/video/list/v2',
		method: 'post',
		data
	})
}
export function shenhe(data){
	return axios({
		url: '/video/check',
		method: 'post',
		data
	})
}
export function getVideoInfo(data){
	return axios({
		url: '/video/info',
		method: 'post',
		data
	})
}
export function getVideoSearchOptions(data){
	return axios({
		url: '/video/search/condition',
		method: 'post',
		data
	})
}

export function playVideo(data){
	return axios({
		url: '/video/play',
		method: 'post',
		data
	})
}

export function checkVideoName(data){
	return axios({
		url: '/video/check/video/name',
		method: 'post',
		data
	})
}
export function addVideoInfo(data){
	return axios({
		url: '/video/add',
		method: 'post',
		data
	})
}
export function editVideoInfo(data){
	return axios({
		url: '/video/update',
		method: 'post',
		data
	})
}
