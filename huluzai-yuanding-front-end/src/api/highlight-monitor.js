import {instance_sys as axios} from './index'

export function getschool(params) {
  return axios({
    url:'/school/highlight',
    method:'get',
    params
  })
}