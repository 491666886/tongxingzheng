import { instance_sys as axios } from './index'
import { instance_login as axios2 } from './index'
export function login(data){
	return axios2({
		url: '/user/login',
		method: 'post',
		data
	})
}


export function logout(data){
	return axios({
		url: '/user/logout',
		method: 'post',
		data
	})
}