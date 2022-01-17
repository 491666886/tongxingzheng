import { instance as axios } from './index'

export function getVideoList(data){
	return axios({
		url: '/permit/list',
		method: 'post',
		data
	})
}
export function getVideoInfo(data){
	return axios({
		url: '/user/list',
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
		url: '/permit/list',
		method: 'post',
		data
	})
}

export function xinzeng(data){
	return axios({
		url: '/permit/add',
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
