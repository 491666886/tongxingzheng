<template>
    <div>
        <ul class="topContent">
            <li>已授权账号数  <span>{{authorizedNum}}</span></li>
            <li>剩余可授权账号数  <span>{{remainNum}}</span></li>
            <li>授权到期时间  <span>{{expireDate}}</span></li>
        </ul>
        <hr>
    </div>
</template>

<script>


  import {
    getMonitorInfo,
  } from  '../../api/highlight-monitor'
  import { getUserInfo, showMsgbox } from '../../utils';

  export default {
    name: "index",
    data(){
      return{
        authorizedNum:0,
        remainNum:0,
        expireDate:'',
      }
    },
    mounted(){
      this.getPageInfo();
    },
    methods:{
      getPageInfo(){
        getMonitorInfo({
          schoolId:getUserInfo().schoolId
        }).then((res)=>{
            this.expireDate = res.highlightExpireDate;
            this.remainNum = res.remainHighlightNum;
            this.authorizedNum = res.openHighlightNum;
        }).catch((err)=>{
            showMsgbox(err);
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
ul{
    list-style: none;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
}
.topContent{
    li{
        display: inline-block;
        margin-right:50px;
        margin-left:0;
        padding:0;
        span{
            color:#FF911D;
        }
    }
}
hr{
    width:94%;
    margin-left:40px;
    margin-bottom:40px;
    border: 1px solid #D4D3D3;

}

</style>
<style lang="scss">

</style>