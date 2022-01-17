<template>
  <el-menu
    :default-active="currentRoute"
    active-text-color="#FF911D"
    background-color="#48433B"
    text-color="#FFF"
    router
    style="flex: none; width: 200px"
  >

    <el-menu-item index="/class-management">
      <i class="iconfont icon-tuoyuanxingx"></i>
      <span slot="title">班级管理</span>
    </el-menu-item>
    <el-menu-item index="/video-monitor-management">
      <i class="iconfont icon-cunchu"></i>
      <span slot="title">服务管理</span>
    </el-menu-item>
    <!--		<el-menu-item index="/video-monitor-management">-->
    <!--			<i class="iconfont icon-a-camera"></i>-->
    <!--			<span slot="title">视频监控管理</span>-->
    <!--		</el-menu-item>-->
    <!-- <el-submenu index="/video-monitor-management">
			<template slot="title">
				<i class="iconfont icon-shipin-tianchong"></i>
				<span>账号授权管理</span>
			</template>
			<el-menu-item index="/video-monitor-management">
				<span slot="title">视频监控管理</span>
			</el-menu-item>
			<el-menu-item index="/highlight-management">
				<span slot="title">高光授权管理</span>
			</el-menu-item>
		</el-submenu> -->
    <el-menu-item index="/teacher-management">
      <i class="iconfont icon-gerenzhongxin"></i>
      <span slot="title">教师用户管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  computed: {
    currentRoute () {
      return this.$route.path
    }
  }
}
</script>
