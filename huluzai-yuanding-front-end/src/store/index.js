import Vue from 'vue';
import VueX from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { getUserInfo, getExpiredInfo } from '../utils';

Vue.use(VueX);

const info = getUserInfo();
 
const store = new VueX.Store({
  state: {
    user: {
      id: info ? info.id : '',
      schoolId: info ? info.schoolId : '',
      school: info ? info.school : '',
      name: info ? info.name : '',
      role: info ? info.role : '',
      phone_num: info ? info.phone_num : '',
      avatar: info ? (info.avatar? info.avatar + '?authorization='+getUserInfo().token: "") : '',
      class_belong: info ? info.class_belong: '',
      class_id: info ? info.class_id : '',
      grade: info ? info.grade : '',
      roleId: info ? info.roleId: '',
      className:  info ? info.className: '',
      schoolCode:  info ? info.schoolCode: '',
    },
    routes: [],// 这个是业务路由，是动态的
    expired: getExpiredInfo()
  },
  mutations,
  actions,
  getters
})

export default store;
