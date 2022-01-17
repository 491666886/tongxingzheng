import {instance_sys as axios} from './index'

export function getMonitorInfo(params) {
  return axios({
    url:'/school/monitor',
    method:'get',
    params
  })
}

export function updateMonitorFlag(data){
  return axios({
    url:'/school/monitor/flag',
    method:'put',
    data
  })
}

export function updateMonitorTime(data){
  return axios({
    url:'/school/monitor/time',
    method:'put',
    data
  })
}
export function getvip(data){
  return axios({
    url:'/kindergarten/online/child/vip',
    method:'post',
    data
  })
}