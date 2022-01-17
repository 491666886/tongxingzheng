<template>
  <div class="header">
    <div class="left">
      <img src="../assets/images/logo.png" class="logo" />
       抗疫应急通行系统  
    </div>
    <div class="right">
      <div class="profile">
        <img
          v-if="userInfo.avatar"
          class="header-avatar"
          :src="userInfo.avatar"
        />
        <i v-else class="iconfont icon-gerenzhongxin placeholder" />
        <div class="dropdown">
          <el-dropdown
            trigger="click"
            @visible-change="handleVisibleChange"
            @command="handleClickDropdown"
          >
            <span class="dropdown-link">
              {{ userInfo.name }}-{{ userInfo.grade | gradeFilter
              }}{{ userInfo.class_belong }}
              <i
                class="iconfont icon-xiasanjiao"
                :class="{ 'upside-down': dropdown }"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人中心</el-dropdown-item>
              <el-dropdown-item command="b" divided>修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="school">{{ userInfo.school }}</span>
        </div>
      </div>
      <div class="line" />
      <i class="iconfont icon-tuichu1 logout" @click="handleLogout" />
    </div>
    <el-dialog
      :title="personalInfoTitle"
      :show-close="false"
      custom-class="my-dialog"
      :visible.sync="personalInfoDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handlePersonalInfoDialogClosed"
    >
      <div class="personal-info-bg">
        <div class="left">
          <img
            v-if="!personalInfoEditing && personalInfoForm.avatar"
            class="avatar"
            :src="personalInfoForm.avatar"
          />
          <img
            v-else-if="!personalInfoEditing"
            class="avatar"
            src="../assets/images/placeholder.jpg"
          />
          <el-upload
            v-else-if="personalInfoEditing"
            action="/gourdbaby/gardener/v1/api/teacher/personal/upload/avatar"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
            :show-file-list="false"
            :headers="myHeaders"
          >
            <div class="upload">
              <img
                v-if="personalInfoForm.avatar"
                class="avatar"
                :src="personalInfoForm.avatar"
              />
              <img
                v-else
                class="avatar"
                src="../assets/images/placeholder.jpg"
              />
              <div slot="trigger" class="btn">修改头像</div>
            </div>
          </el-upload>
        </div>
        <div class="right">
          <el-form
            label-width="69px"
            ref="piForm"
            :rules="personalInfoRules"
            :model="personalInfoForm"
          >
            <el-form-item label="姓名">
              <span>{{ userInfo.name }}</span>
            </el-form-item>
            <el-form-item label="学校">
              <span>{{ userInfo.school }}</span>
            </el-form-item>
          
            <el-form-item label="班级">
              <span class="content">{{ userInfo.className }}</span>
            </el-form-item>
            <el-form-item label="手机号" prop="phone_num">
              <el-input
                v-model="personalInfoForm.phone_num"
                :disabled="disabled"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-loading="isPersonalCommitting"
          @click="handlePersonalInfoDialogConfrm"
        >
          {{ personalInfoConfirmBtnText }}
        </el-button>
        <el-button
          class="dialog-cancel-btn"
          @click="handlePersonalInfoDialogCancel"
        >
          取 消
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
          <el-form-item label="旧密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password />
          </el-form-item>
          <el-form-item label="新密码二次确认" prop="confirm_pwd">
            <el-input v-model="pwdForm.confirm_pwd" show-password />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-loading="isPwdCommitting"
          @click="pwdConfirm"
        >
          确 定
        </el-button>
        <el-button class="dialog-cancel-btn" @click="pwdDialogVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { showMsgbox, getUserInfo, checkPhoneNum, Rsa} from "../utils";
import { logout } from "../api/user";
import { editPersonalInfo, changePwd } from "../api/user";
import { getPersonalInfo } from "../api/user";


export default {
  data() {
    return {
      disabled:true,
      myHeaders: {
        "App-Type": "pc,2.1.0,gardener,browser,h5",
        "Authorization": getUserInfo().token,
      },
      dropdown: false,
      personalInfoDialogVisible: false,
      pwdDialogVisible: false,
      personalInfoEditing: false,
      personalInfoForm: {
        grade: this.$store.getters.userInfo.grade,
        class_belong: this.$store.getters.userInfo.class_belong,
        phone_num: this.$store.getters.userInfo.phone_num,
        avatar: this.$store.getters.userInfo.avatar,
        headImgRelate: "",
      },
      personalInfoRules: {
        phone_num: [
          {
            validator: checkPhoneNum,
            trigger: "manual",
          },
        ],
      },
      pwdForm: {
        old_pwd: "",
        new_pwd: "",
        confirm_pwd: "",
      },
      pwdRules: {
        confirm_pwd: [
          {
            validator: this.pwdConfirmValidator,
            trigger: "manual",
          },
        ],
      },
      isPersonalCommitting: false,
      isPwdCommitting: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
   
    personalInfoTitle() {
      return this.personalInfoEditing ? "个人信息修改" : "个人信息";
     
    },
    personalInfoConfirmBtnText() {
      return this.personalInfoEditing ? "确定" : "修改信息";
    },
  },
  
  methods: {
    handleClickDropdown(command) {
  
      if (command === "a") {
        // 个人中心
        this.personalInfoDialogVisible = true;
      } else {
        // 修改密码
        this.pwdDialogVisible = true;
      }
    },
    handleVisibleChange(visible) {
      this.dropdown = visible;
    },
    handlePersonalInfoDialogClosed() {
      this.personalInfoEditing = false;
      this.$refs.piForm.clearValidate();
    },
    handlePersonalInfoDialogConfrm() {
      if (this.personalInfoEditing) {
        this.$refs.piForm.validate((valid) => {
          if (valid) {
            this.isPersonalCommitting = true;
            editPersonalInfo({
              id: getUserInfo().id,
              mobile: this.personalInfoForm.phone_num,
              userHeadImg: this.personalInfoForm.avatar,
              headImgRelate: this.personalInfoForm.headImgRelate,
            })
              .then(() => {
                showMsgbox("修改成功", true);
                this.isPersonalCommitting = false;
                this.personalInfoEditing = false;
                this.personalInfoDialogVisible = false;
                this.getPersonalInfo();
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.isPersonalCommitting = false;
              });
          }
        });
      } else {
        this.personalInfoEditing = true;
      }
    },
    getPersonalInfo() {
      getPersonalInfo({
        id: getUserInfo().id,
      })
        .then((res) => {
          this.personalInfoForm.avatar = res.userHeadImg;
          const user = this.$store.getters.userInfo;
          this.$store.commit({
            type: "SET_USER",
            userInfo: {
              ...user,
              avatar: res.userHeadImg,
              phone_num: res.mobile,
            },
          });
        })
        .catch((msg) => {
          showMsgbox(msg);
        });
    },
    pwdConfirmValidator(rule, value, callback) {
      if (this.pwdForm.new_pwd !== value) {
        callback(new Error("确认密码须与新密码一致"));
      } else {
        callback();
      }
    },
    handleBeforeUpload(file) {
      const fileTypes = ["image/jpeg", "image/png"];
      const exts = ["jpg", "png", "jpeg"];
      const ext = file.name.split(".").pop();
      const isImg =
        fileTypes.indexOf(file.type) !== -1 ;
      if (!isImg) {
        showMsgbox("上传头像只能是jpg或png格式");
      }
      return isImg;
    },
    handleUploadSuccess(res) {
      this.personalInfoForm.avatar = res.data.headImg;
      this.personalInfoForm.headImgRelate = res.data.headImgRelate;
    },
    handleUploadError(err) {
      showMsgbox(err);
    },
    handlePersonalInfoDialogCancel() {
      if (this.personalInfoEditing) {
        this.$refs.piForm.clearValidate();
        this.personalInfoForm.phone_num = this.$store.getters.userInfo.phone_num;
        this.personalInfoEditing = false;
      } else {
        this.personalInfoDialogVisible = false;
      }
    },
    handlePwdDialogClosed() {
      this.pwdForm = {
        old_pwd: "",
        new_pwd: "",
        confirm_pwd: "",
      };
      this.$refs.pwdForm.clearValidate();
    },
    pwdConfirm() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.isPwdCommitting = true;
          changePwd({
            id: getUserInfo().id,
            newPassword: Rsa(this.pwdForm.new_pwd),
            newPassword2: Rsa(this.pwdForm.confirm_pwd),
            password: Rsa(this.pwdForm.old_pwd),
          })
            .then(() => {
              showMsgbox("修改成功", true);
              this.pwdDialogVisible = false;
              this.isPwdCommitting = false;
            })
            .catch((msg) => {
              showMsgbox(msg);
              this.isPwdCommitting = false;
            });
        }
      });
    },
    handleLogout() {
      this.$confirm("确定要退出吗?", "提示", {
        type: "info",
      }).then(() => {
        logout()
          .then(() => {
            sessionStorage.clear();
            this.$store.commit("CLEAR_CACHE");
            this.$store.commit("SET_EXPIRED", false);
            this.$router.push("/login");
          })
          .catch(() => {
            showMsgbox("注销失败");
          });
      });
    },
  },
};
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
  color: #fff;

  & > div {
    display: flex;
    align-items: center;
    height: 100%;
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
      .header-avatar {
        margin-left: w(20);
        margin-right: w(10);
        height: h(64);
        width: w(64);
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
  padding: 0 30px;
  display: flex;
  .left {
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .upload {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .avatar {
      width: 198px;
      height: 222px;
    }
    .btn {
      margin-top: 18px;
      width: 130px;
      height: 30px;
      border-radius: 15px;
      background-color: $blue;
      color: #fff;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .right {
    margin-left: 70px;
    padding: 8px 0 63px 0;
    .item {
      display: flex;
      align-items: center;
      line-height: 20px;
      .title {
        width: 46px;
        flex: none;
        margin-right: 16px;
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
