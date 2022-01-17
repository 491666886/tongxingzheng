<template>
  <div class="header">
    <div class="left">
      <img
        src="../assets/images/logo.png"
        class="logo"
      >
       抗疫应急通行系统 
    </div>
    <div class="right">
      <div class="profile">
        <div class="dropdown">
          <el-dropdown
            trigger="click"
            @visible-change="handleVisibleChange"
            @command="handleClickDropdown"
          >
            <span class="dropdown-link">
              {{ userInfo.name }}-{{ userInfo.role }}
              <i
                class="iconfont icon-xiasanjiao"
                :class="{'upside-down': dropdown }"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人中心</el-dropdown-item>
              <el-dropdown-item
                command="b"
                divided
              >修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="school">{{ userInfo.school }}</span>
        </div>
      </div>
      <div class="line" />
      <i
        class="iconfont icon-tuichu1 logout"
        @click="handleLogout"
      />
    </div>
    <el-dialog
      title="个人信息"
      :show-close="false"
      custom-class="my-dialog"
      :visible.sync="personalInfoDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="personal-info-bg vertical-middle">
        <div class="wrapper">
          <div class="item">
            <span class="title">姓名:</span>
            <span class="content">{{ userInfo.name }}</span>
          </div>

          <div class="item">
            <span class="title">学园:</span>
            <span class="content">{{ userInfo.school }}</span>
          </div>
          <div class="item">
            <span class="title">手机号:</span>
            <span class="content">{{ userInfo.phone_num }}</span>
          </div>
          <div class="item">
            <span class="title">用户权限:</span>
            <span class="content">{{ userInfo.role }}</span>
          </div>
          <div class="item">
            <span class="title">园方ID:</span>
            <span class="content">{{ userInfo.schoolCode }}</span>
          </div>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="dialog-cancel-btn"
          @click="handlePersonalInfoDialogCancel"
        >
          关 闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :show-close="false"
      custom-class="my-dialog"
      :visible.sync="pwdDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handlePwdDialogClosed"
    >
      <div class="pwd-bg">
        <el-form
          label-width="111px"
          ref="pwdForm"
          :model="pwdForm"
          :rules="pwdRules"
        >
          <el-form-item
            label="旧密码"
            prop="old_pwd"
          >
            <el-input
              v-model="pwdForm.old_pwd"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="new_pwd"
          >
            <el-input
              v-model="pwdForm.new_pwd"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="新密码二次确认"
            prop="confirm_pwd"
          >
            <el-input
              v-model="pwdForm.confirm_pwd"
              show-password
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          v-loading="isCommitting"
          @click="pwdConfirm"
        >
          确 定
        </el-button>
        <el-button
          class="dialog-cancel-btn"
          @click="pwdDialogVisible = false"
        >
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { showMsgbox, getUserInfo, Rsa } from '../utils';
import { logout } from '../api/login';
import { changePwd } from '../api/log';
import store from "../store";

export default {
  data () {
    return {
      dropdown: false,
      personalInfoDialogVisible: false,
      pwdDialogVisible: false,
      personalInfoForm: {
        role: this.$store.getters.userInfo.role,
        phone_num: this.$store.getters.userInfo.phone_num,
      },
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      },
      pwdRules: {
        confirm_pwd: [{
          validator: this.pwdConfirmValidator,
          trigger: 'manual'
        }]
      },
      isCommitting: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    handleClickDropdown (command) {
      if (command === 'a') { // 个人中心
        this.personalInfoDialogVisible = true;
      } else { // 修改密码
        this.pwdDialogVisible = true;
      }
    },
    handleVisibleChange (visible) {
      this.dropdown = visible;
    },
    pwdConfirmValidator (rule, value, callback) {
      if (this.pwdForm.new_pwd !== value) {
        callback(new Error('确认密码须与新密码一致'))
      } else {
        callback();
      }
    },
    handlePersonalInfoDialogCancel () {
      this.personalInfoDialogVisible = false;
    },
    handlePwdDialogClosed () {
      this.pwdForm = {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      };
      this.$refs.pwdForm.clearValidate();
    },
    pwdConfirm () {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.isCommitting = true;
          changePwd({
            id: getUserInfo().id,
            newPassword: Rsa(this.pwdForm.new_pwd),
            newPassword2: Rsa(this.pwdForm.confirm_pwd),
            password: Rsa(this.pwdForm.old_pwd)
          }).then(() => {
            showMsgbox('修改密码成功', true);
            this.pwdDialogVisible = false;
            this.isCommitting = false;
          }).catch((msg) => {
            showMsgbox(msg);
            this.isCommitting = false;
          })

        }
      });
    },
    handleLogout () {
     
      this.$confirm('确定要退出吗?', '提示', {
        type: 'info',
      }).then(() => {
        logout().then(() => {
          sessionStorage.clear();
          this.$store.commit('CLEAR_CACHE');
          this.$router.push('/login');
           console.log(store.getters.routes.length,'232323232222');
        }).catch(() => {
          showMsgbox('注销失败');
          sessionStorage.clear();
          this.$store.commit('CLEAR_CACHE');
          this.$router.push('/login');
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/main';
@import '../style/element-variables';
.vertical-middle {
  flex-direction: unset !important;
}
.personal-info-bg .wrapper .item {
  display: unset !important;
}
.header {
  height: $nav-header-height;
   width: 100vw;
  background-color: $--color-primary;
  position: relative;
  display: flex;
   justify-content: space-between;
  color: #fff;

  & > div {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .right{
   
  }
  .left {
    font-size: h(26);
    font-weight: 500;
    .logo {
      height: h(35);
      margin-left: w(20);
      margin-right: w(10);
    }
  }

  .right {
    .profile {
      display: flex;
      margin-right: w(20);
      color: #fff;
      align-items: center;
      .placeholder {
        font-size: h(50);
      }
      .dropdown {
        display: flex;
        flex-direction: column;
        .dropdown-link {
          display: flex;
          align-items: center;
          color: #fff;
          font-size: h(16);
          line-height: h(22);
          margin-bottom: h(2);
          cursor: pointer;
        }
        .school {
          line-height: h(20);
          font-size: h(14);
        }
      }
    }

    .logout {
      font-size: h(22);
      margin-right: w(20);
      cursor: pointer;
    }

    .line {
      height: h(40);
      width: w(1);
      background-color: #fff;
      margin-right: w(20);
    }
  }
}
/* 个人中心 */
.personal-info-bg {
  .wrapper {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      align-items: center;
      line-height: 20px;
      .title {
        width: 60px;
        flex: none;
        margin-right: 16px;
        text-align: right;
      }
      .content {
        flex: auto;
      }
    }
  }
}
.pwd-bg {
  display: flex;
  justify-content: center;
  .el-form-item:last-of-type {
    margin-bottom: 0;
  }
  .el-input {
    width: 200px;
  }
}
.item + .item {
  margin-top: 36px;
}
.input + .input {
  margin-top: 20px;
}
.input-first {
  margin-top: 27px !important;
}
</style>
