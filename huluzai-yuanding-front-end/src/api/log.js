import { instance as axios, instance_sys as axios2 } from './index'
import { instance_login as axios3 } from './index'
export function getPersonalInfo(params){
	return axios2({
		url: '/user/info',
		params
	})
}
export function editPersonalInfo(data){
	return axios({
		url: '/personal/update',
		method: 'post',
		data
	})
}
export function changePwd(data){
	return axios3({
		url: '/user/password/change',
		method: 'post',
		data
	})
}

export function logout(data){
	return axios2({
		url: '/user/logout',
		method: 'post',
		data
	})
}