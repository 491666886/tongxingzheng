<template>
  <div class="login-bg">
    <!-- <img
      class="login-logo"
      src="../../assets/images/logo.png"
    /> -->
    <span class="logo-text"> 抗疫应急通行系统 </span>

    <div class="login-right">
      <el-form :model="form" :rules="rules" ref="form" class="login-form">
        <el-form-item prop="account" ref="account">
          <el-input
            v-model="form.account"
            placeholder="请输入登录验证码"
            @focus="handleFocus('account')"
            @keyup.enter.native="handleLogin()"
          >
            <img
              src="../../assets/images/login_user.png"
              class="login-user-img"
              slot="prefix"
            />
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          prop="password"
          ref="pwd"
        >
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            class="password"
            show-password
            @focus="handleFocus('pwd')"
            @keyup.enter.native="handleLogin()"
          >
            <img
              src="../../assets/images/login_pwd.png"
              class="login-pwd-img"
              slot="prefix"
            />
          </el-input>
        </el-form-item> -->
      </el-form>
      <!--				<div class="login-helper">-->
      <!--					<span>-->
      <!--						<el-checkbox v-model="isAutoLogin" class="box" />-->
      <!--						自动登录-->
      <!--					</span>-->
      <!--					<span class="forget" @click="handleClickForget">忘记密码?</span>-->
      <!--				</div>-->
      <div class="login-btn" v-loading="clickLogin" @click="handleLogin">
        登录
      </div>
    </div>
  </div>
</template>
<script>
import { showMsgbox, checkPhoneNum, Rsa } from "../../utils";
import { login } from "../../api/login";
import { getPersonalInfo } from "../../api/user";
import { checkExpired } from "../../api/timeline";
import { setToken } from "../../utils";

export default {
  data() {
    return {
      form: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          {
            required: true,
            message: "登录验证码不能为空",
            trigger: "manual",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "manual",
          },
        ],
      },
      clickLogin: false,
      isAutoLogin: false,
    };
  },
  methods: {
    handleLogin() {
      if (!this.clickLogin) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.clickLogin = true;
              // this.$router.push('/home');

              // this.$router.push('/victory');
            login({
              passport: this.form.account,
            })
              .then((res) => {
                console.log(res);
                sessionStorage.setItem("gardenertoken", res.token);
                sessionStorage.setItem("userid", res.userInfo.id);
                 sessionStorage.setItem("username", res.userInfo.name);
                  sessionStorage.setItem("usernum", res.userInfo.permitMaxNum-res.userInfo.currentPermitNum);
                if (res.userInfo.level === 0) {
                  // 登录角色为区政府
                  this.$router.push("/home");
                } else {
                  this.$router.push("/victory");
                }
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.clickLogin = false;
              });
          }
        });
      }
    },
    handleFocus(e) {
      this.$refs[e].clearValidate();
    },
  },
};
</script>
<style lang="scss">
@import "../../style/main";
@import "../../style/element-variables";

.login-bg {
  // background-image: url('../../assets/images/login_bg.png');
  background-color: cadetblue;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}
.login-logo {
  width: w(39);
  height: h(38);
  position: absolute;
  left: w(720);
  top: h(280);
}

.logo-text {
  position: absolute;
  color: #fff;
  top: h(273);
  left: w(770);
  font-size: h(32);
}

.left-text {
  position: absolute;
  left: w(441);
  top: h(753);
  width: w(376);
  height: h(80);
}
.login-right {
  position: absolute;
  left: w(726);
  top: h(368);
  width: w(420);
  height: h(450);
  border-radius: h(10);
  box-sizing: border-box;
  background-color: #fff;
  opacity: 0.85;
  padding: h(86) w(45) h(68);
  & > div {
    width: 100%;
  }
}
.login-form {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      line-height: h(50);
      input::-webkit-input-placeholder {
        color: #d8b188;
        font-size: h(18);
      }
      input::-ms-input-placeholder {
        color: #d8b188;
        font-size: h(18);
      }
      .el-input {
        height: 100%;
        .el-input__prefix {
          left: w(14);
          display: flex;
          align-items: center;
        }
        .el-input__inner {
          height: h(50);
          line-height: h(50);
          padding-left: w(42);
        }
      }
      .password {
        .el-input__prefix {
          left: w(15);
        }
      }
    }
  }
  .el-form-item + .el-form-item {
    margin-top: h(40);
  }
}
.login-user-img {
  width: w(20);
  height: h(24);
}
.login-pwd-img {
  width: w(18);
  height: h(22);
}
.login-helper {
  margin-top: h(8);
  display: flex;
  justify-content: space-between;
  color: #fff;
  line-height: h(25);
  font-size: h(18);
  .box {
    margin-right: 3px;
  }
}

.login-btn {
  margin-top: h(96);
  height: h(60);
  border-radius: w(4);
  box-sizing: border-box;
  cursor: pointer;
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $--color-primary;
  color: #fff;
}
</style>
