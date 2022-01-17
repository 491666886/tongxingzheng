<template>
  <div class="container">
    <nav-header />
    <div class="content">
      <nav-menu />
      <div class="wrapper">
        <!-- <div
          v-if="isExpired"
          class="expired"
        >
          <div class="left">
            <i class="iconfont icon-tishi first"/>
            课表信息过期，请更新！
          </div>
          <i class="iconfont icon-shanchu1 del pointer" @click="handleX"/>
        </div> -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  import NavHeader from './nav-header';
  import NavMenu from './nav-menu';
  import { mapGetters } from 'vuex';

  export default {
    components: { NavHeader, NavMenu },
    computed: {
      ...mapGetters(['isExpired'])
    },
    methods: {
      handleX() {
        this.$store.commit('SET_EXPIRED', false);
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "../style/main";
  .container {
    width: 100%;
    height: 100%;
  }
  .content {
    width: 100%;
    overflow-x: hidden;// 防止出现整体横向滚动条
    height: calc(100% - #{$nav-header-height});
    display: flex;
    .wrapper {
      flex: auto;
      overflow-y: auto;
    }
    .expired {
      background-color: $warning;
      color: $warning-color;
      height: 30px;
      width: 100%;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 22px;
      .left {
        height: 100%;
        display: flex;
        align-items: center;
        .first {
          margin: 0 5px 0 20px;
        }
      }
      .del {
        margin-right: 20px;
      }
    }
  }
</style>
