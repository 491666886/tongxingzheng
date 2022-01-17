<template>
	<div class="header">
		<div>
			<img src="../assets/images/logo.png" class="logo">
			 抗疫应急通行系统
		</div>
	</div>
</template>

<script>
	export default {
		name: "NavHeaderPure"
	}
</script>

<style lang="scss" scoped>
	@import "../style/main";
	@import "../style/element-variables";

	.header {
		height: $nav-header-height;
		width: 100%;
		background-color: $--color-primary;
		position: relative;
		display: flex;
		justify-content: space-between;
		color: #FFF;

		& > div {
			display: flex;
			align-items: center;
			height: 100%;
			font-size: h(26);
			font-weight: 500;
			.logo {
				margin-left: w(20);
				margin-right: w(10);
			}
		}
	}
</style>
