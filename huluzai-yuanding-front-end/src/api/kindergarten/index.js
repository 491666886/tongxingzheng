import axios from 'axios';
import { getUserInfo } from "../../utils";

import {
  responseUseFailed,
  responseUseSuccess,
  requestUseFailed,
  requestUseSuccess
} from '../index';

const instance = axios.create({
  baseURL: '/gourdbaby/gardener/v1/api/kindergarten',
  timeout: 10000,
})
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers["App-Type"] = "pc,1.1.0,gardener,browser,h5";
  config.headers["Authorization"] =  getUserInfo().token;
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance.interceptors.request.use(requestUseSuccess, requestUseFailed)
instance.interceptors.response.use(responseUseSuccess, responseUseFailed);

export { instance };
