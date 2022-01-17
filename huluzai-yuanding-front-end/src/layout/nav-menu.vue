<template>
  <el-menu
    :default-active="currentRoute"
    active-text-color="#FF911D"
    background-color="#48433B"
    text-color="#FFF"
    router
    style="width: 200px;flex:none;"
  >
    <!-- <el-menu-item index="/video-management">
			<i class="iconfont icon-shipin-tianchong"></i>
			<span slot="title">视频管理</span>
		</el-menu-item> -->
    <el-submenu index="/video-management">
      <template slot="title">
        <i class="iconfont icon-shipin-tianchong"></i>
        <span>视频管理</span>
      </template>
      <el-menu-item index="/video-management/auditing-management">
        视频审核
      </el-menu-item>
      <!-- <el-menu-item index="/video-management">
        视频上传
      </el-menu-item> -->
    </el-submenu>
    <el-submenu index="/class-management">
      <template slot="title">
        <i class="iconfont icon-tuoyuanxingx"></i>
        <span>班级管理</span>
      </template>
      <el-menu-item index="/class-management/student-info-management">
        学生信息管理
      </el-menu-item>
      <!-- <el-menu-item index="/class-management/time-table-management">
        课表管理
      </el-menu-item> -->
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },
};
</script>
