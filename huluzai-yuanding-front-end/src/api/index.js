import axios from "axios";
import router from "../router";
import store from "../store";
import { getUserInfo } from "../utils";
const instance_login = axios.create({
  baseURL: "http://121.36.97.239:8080",
  timeout: 50000,
});
const instance_sys = axios.create({
  baseURL:"http://121.36.97.239:8080",
  timeout: 50000,
});
const instance = axios.create({
  baseURL: "http://121.36.97.239:8080",
  timeout: 50000,
});
//此axios返回全部res信息
const instance_res = axios.create({
  baseURL: "http://121.36.97.239:8080",
  timeout: 50000,
});

// 添加请求拦截器
instance_login.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance_sys.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  
 
  config.headers["accessToken"] = sessionStorage.getItem("gardenertoken");
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  
  config.headers["accessToken"] = sessionStorage.getItem("gardenertoken");
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加请求拦截器
instance_res.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  
  config.headers["accessToken"] =  getUserInfo().token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


export function requestUseSuccess(config) {
  return config;
}
export function requestUseFailed(error) {
  return Promise.reject(error);
}
export function responseUseSuccess(response) {
  if (response.data.code === 200) {
    return response.data.data;
  } else if (response.data.code === 401 ||response.data.code === 10007||response.data.code === 10008) {
    store.commit("CLEAR_CACHE");
    router.push("/login");
  }
  return Promise.reject(response.data.message);
}
export function responseUseFailed(error) {

  return Promise.reject("网络出现问题");
}
export function responseUseSuccess_res(response) {
  // if (response.data.code === 0 || response.data.code === 20023) {
   
  if (response.data.code || response.data.code === 0) {
    return response.data;
  }
  return Promise.reject(response.data.message);
}



instance_sys.interceptors.request.use(requestUseSuccess, requestUseFailed);
instance_sys.interceptors.response.use(responseUseSuccess, responseUseFailed);

instance.interceptors.request.use(requestUseSuccess, requestUseFailed);
instance.interceptors.response.use(responseUseSuccess, responseUseFailed);

instance_res.interceptors.request.use(requestUseSuccess, requestUseFailed);
instance_res.interceptors.response.use(responseUseSuccess_res, responseUseFailed);
instance_login.interceptors.request.use(requestUseSuccess, requestUseFailed);
instance_login.interceptors.response.use(responseUseSuccess, responseUseFailed);
export { instance_sys, instance ,instance_res,instance_login};
