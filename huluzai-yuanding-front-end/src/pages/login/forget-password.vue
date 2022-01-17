<template>
	<div class="bg">
		<pure-nav-header/>
		<div class="top">
			<div class="frag" :class="{'active': step >= 1}">
				<img src="../../assets/images/forgetpwd-1.png"/>
				身份验证
			</div>
			<div class="frag" :class="{'active': step >= 2}">
				<img v-if="step <= 1" src="../../assets/images/forgetpwd-2.png"/>
				<img v-else src="../../assets/images/forgetpwd-4.png">
				设置密码
			</div>
			<div class="frag" :class="{'active': step >= 3}">
				<img v-if="step <= 2" src="../../assets/images/forgetpwd-3.png"/>
				<img v-else src="../../assets/images/forgetpwd-5.png">
				设置成功
			</div>
		</div>
		<div class="middle">
			<el-form
				v-if="step === 1"
				:model="form1"
				:rules="form1_rules"
				label-width="110px"
				ref="form1"
			>
				<el-form-item
					label="请输入手机号"
					prop="phone_num"
				>
					<div class="pure-vertical-middle">
						<el-input v-model="form1.phone_num" :disabled="sending" />
						<span
							v-if="!sending"
							class="send common-btn"
							@click="sendVerifyCode"
						>
							发送验证码
						</span>
						<span
							v-else
							class="send common-btn not-allowed"
							@click="sendVerifyCode"
						>
							{{ secondsLeft }}
						</span>
					</div>
				</el-form-item>
				<el-form-item
					label="请输入验证码"
					prop="verify_code"
				>
					<el-input v-model="form1.verify_code"/>
				</el-form-item>
			</el-form>
			<el-form
				v-else-if="step === 2"
				:model="form2"
				:rules="form2_rules"
				label-width="110px"
				ref="form2"
			>
				<el-form-item
					label="请输入新密码"
					prop="password"
				>
					<el-input v-model="form2.password"/>
				</el-form-item>
				<el-form-item
					label="请确认新密码"
					prop="confirm_pwd"
				>
					<el-input v-model="form2.confirm_pwd"/>
				</el-form-item>
			</el-form>
			<div v-else class="done vertical-middle">
				<i class="iconfont icon-chenggong success"></i>
				设置成功!
			</div>
		</div>
		<div
			class="bottom common-btn"
			@click="handleClickBtn"
		>
			{{ btnTitle }}
		</div>
	</div>
</template>

<script>
	import PureNavHeader from '../../layout/nav-header-pure';
	import { checkPhoneNum } from '../../utils';
	export default {
		name: "ForgetPassword",
		components: {
			PureNavHeader
		},
		data() {
			return {
				form1: {
					phone_num: '',
					verify_code: '',
				},
				form2: {
					password: '',
					confirm_pwd: '',
				},
				form1_rules: {
					phone_num: [{
						validator: checkPhoneNum,
						trigger: 'manual'
					}],
					verify_code: [{
						validator: (rule,value,callback) => {
							if (value.trim()) {
								callback();
							} else {
								callback(new Error('验证码不能为空'));
							}
						},
						trigger: 'manual'
					}]
				},
				form2_rules: {
					password: [{
						validator: (rule,value,callback) => {
							if (value.trim()) {
								callback();
							} else {
								callback(new Error('新密码不能为空'));
							}
						},
						trigger: 'manual'
					}],
					confirm_pwd: [{
						validator: this.pwdConfirmValidator,
						trigger: 'manual'
					}]
				},
				step: 1,
				secondsLeft: 60,
				timer: null,
				sending: false,
			}
		},
		computed: {
			btnTitle() {
				if (this.step < 3) {
					return '下一步';
				}
				return '完成';
			}
		},
		methods: {
			sendVerifyCode() {
				if (!this.sending) {
					this.$refs.form1.validateField('phone_num', (error) => {
						if (!error) {
							this.sending = true;
							this.timer = setInterval(() => {
								if (this.secondsLeft <= 0) {
									this.sending = false;
									this.secondsLeft = 60;
									clearInterval(this.timer);
								} else {
									this.secondsLeft -= 1;
								}
							}, 1000)
						}
					})
				}
			},
			pwdConfirmValidator(rule, value, callback) {
				if (this.form2.password !== value) {
					callback(new Error('确认密码须与新密码一致'))
				} else {
					callback();
				}
			},
			handleClickBtn() {
				if (this.step === 1) {
					this.$refs.form1.validate((valid) => {
						if (valid) {
							this.step = 2;
							clearInterval(this.timer);
						}
					})
				} else if (this.step === 2) {
					this.$refs.form2.validate((valid) => {
						if (valid) {
							this.step = 3;
						}
					})
				} else {
					this.$router.push('/login')
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../style/main";
	@import "../../style/element-variables";
	.bg {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.top {
		margin-top: 80px;
		display: flex;
	}
	.frag {
		width: 33.3%;
		height: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		img {
			margin-bottom: 19px;
		}
	}
	.middle {
		margin-top: 82px;
	}
	.done {
		color: $message-box-text-color;
		font-size: 24px;
	}
	.success {
		font-size: 90px;
		color: $green;
		margin-bottom: 20px;
	}
	.bottom {
		margin-top: 91px;
		width: 90px;
		height: 36px;
		background: $--color-primary;
		border-radius: 4px;
		color: #FFF;
	}
	.active {
		color: $blue;
	}
	.send {
		margin-left: 10px;
		flex: none;
		width:90px;
		height:30px;
		background: $table-header-btn-bg-color-primary;
		border-radius:3px;
		border:1px solid $--color-primary;
		color: $--color-primary;
	}
	.el-input {
		width: 200px;
	}
	.not-allowed {
		cursor: not-allowed;
		color: $gray;
	}
</style>
