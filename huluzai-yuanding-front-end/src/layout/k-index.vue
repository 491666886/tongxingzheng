<template>
  <div class="container">
    <nav-header />
    <div class="content">
      <nav-menu />
      <div class="wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  import NavHeader from './k-nav-header';
  import NavMenu from './k-nav-menu';

  export default {
    components: { NavHeader, NavMenu },
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
  }
  .wrapper {
    flex: auto;
    overflow-x: hidden;
    overflow-y: auto ;
  }
</style>
