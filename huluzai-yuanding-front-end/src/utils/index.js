import Cookie from 'js-cookie';
import { MessageBox } from 'element-ui';
import JSEncrypt from "jsencrypt"; 

const tokenKey = 'huluzai-gardener-user';
const expiredKey = 'huluzai-gardener-teacher-end-timeline-expired';

export function getUserInfo() {
  
   let str= sessionStorage.getItem('userInfo');
   return JSON.parse(str);
}
export function setUserInfo(userInfo) {

  sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
  // Cookie.set(tokenKey, userInfo)
}
export function clearToken() {
  Cookie.remove(tokenKey);
}

export function getExpiredInfo() {
  return Cookie.get(expiredKey) === '1';
}
export function setExpiredInfo(value) {
  Cookie.set(expiredKey, value);
}
export function Rsa(password) {
  let encryptor  = new JSEncrypt();
  let publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKabat2KvzTalFydqFtBzbgPBAfVPzn5aRQ2kjc2l5rmXxOr7iu1fFPGV2VHTxz2Jv4v/M4ALxC1zkpevGheN/cCAwEAAQ==`
  encryptor.setPublicKey(publicKey);
  let param = encryptor.encrypt(password)
  
  return param
}
export function formatFileSize(value) {
  if (!value){
    return '0KB';
  }
  const unitArr = ['Bytes','KB', 'MB', 'GB', 'TB', 'PB', 'EB','ZB', 'YB'];
  const srcsize = parseFloat(value);
  const index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size =srcsize / Math.pow(1024, index);
  size = size.toFixed(2);//保留的小数位数
  return size + unitArr[index];
}
export function gradeFilter(value) {
  switch (value) {
    case 1:
      return '小'
    case 2:
      return '中'
    case 3:
      return '大'
  }
}
export function termFilter(value) {
  return value === '1'?'上':'下';
}
export function generateMinutes() {
  const res = [];
  for (let i = 0; i < 60; i ++) {
    if (i < 10) {
      res.push({
        key: i,
        label: `0${i}`,
        value: `0${i}`
      })
    } else {
      res.push({
        key: i,
        label: `${i}`,
        value: `${i}`
      })
    }
  }
  return res;
}
export function generateHours() {
  const res = [];
  for (let i = 0; i < 24; i ++) {
    if (i < 10) {
      res.push({
        key: i,
        label: `0${i}`,
        value: `0${i}`
      })
    } else {
      res.push({
        key: i,
        label: `${i}`,
        value: `${i}`
      })
    }
  }
  return res;
}
export function generateWeek() {
  const res = [];
  for (let i = 0; i < 20; i ++) {
    res.push({
      key: i,
      label: `${i + 1}`,
      value: `${i + 1}`
    })
  }
  return res;
}
export function formateDate(date) {
  const m = date.getMonth();
  const month = m > 8 ? m + 1 : `0${m + 1}`;
  return `${date.getFullYear()}-${month}-${date.getDate()}`
}

export function showMsgbox(msg, success) {
  MessageBox({
    title: '提示',
    type: success ? 'success' : 'error',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    message: msg,
    showCancelButton: false,
    confirmButtonText: '知道了',
  }).then(() => {})
}
const phoneReg = /^1[3456789]\d{9}$/;
const tuoMingPhoneReg = /^1[3456789]\d{1}\*{4}\d{4}$/;
const positiveIntegerReg = /^(0|[1-9][0-9]*)$/;
const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

export function checkPhoneNum(rule, value, callback) {
  if (phoneReg.test(value) || tuoMingPhoneReg.test(value)) {
    callback()
  } else  if(value.length<1){
    callback()
  } else {
    callback(new Error('请输入正确的手机号码'))
  }
}

export function checkIdCardNum(rule, value, callback){
  if (idReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号'));
  }
}
export function checkPositiveInteger(rule, value, callback) {
  if (positiveIntegerReg.test(value)) {
    callback()
  } else {
    callback(new Error('只能输入0或者正整数'))
  }
}
//1.加密解密方法使用：

//1.加密
// var str = '124中文内容';
// var base = new Base64();
// var result = base.encode(str);
// //document.write(result);

// //2.解密
// var result2 = base.decode(result);
// document.write(result2);
// //2.加密、解密算法封装：



