<template>
  <div style="overflow:hidden;zoom:100%;">
    <div
      class="left"
      v-if="showswitch"
    >
      <div class="ggsjff">高光时刻服务</div>
      <ul class="topContent">
        <li>
          已授权账号数 <span>{{ authorizedNum1 }}</span>
        </li>
        <li>
          剩余可授权账号数 <span>{{ remainNum1 }}</span>
        </li>
        <li>
          授权到期时间 <span>{{ expireDate1 }}</span>
        </li>
      </ul>
      <hr />
    </div>
    <div
      v-if="showstudet"
      class="right"
    >
      <div class="ggsjff">视频监控服务</div>
      <ul
        v-if="showswitch"
        class="topContent"
      >
        <li>
          已授权账号数 <span>{{ authorizedNum }}</span>
        </li>
        <li>
          剩余可授权账号数 <span>{{ remainNum }}</span>
        </li>
        <li>
          授权到期时间 <span>{{ expireDate }}</span>
        </li>
      </ul>
      <hr v-if="showswitch" />
      <ul class="bottomContent">
        <li>
          视频监控服务状态：
          <el-switch
            @change="switchChange"
            v-model="isOpen"
            active-color="#65A6FD"
            inactive-color="#999999"
          >
          </el-switch>
        </li>
        <!-- <li>
          视频监控开放时段：
          <el-time-picker
            v-if="isOpen"
            v-model="monitorStartTime"
            @change="timeChange($event, 1)"
            format="HH:mm:ss"
            value-format="HH:mm"
            :picker-options="{
              selectableRange: '06:00:00 - 19:59:00',
            }"
            placeholder="请选择"
          >
          </el-time-picker>
          <el-time-picker
            v-if="isOpen"
            v-model="monitorEndTime"
            @change="timeChange"
            format="HH:mm:ss"
            value-format="HH:mm"
            :picker-options="{
              selectableRange: `${monitorEndTimeStart + ':00'} - 20:00:00`,
            }"
            placeholder="请选择"
          >
          </el-time-picker>
          <span v-else>{{ timeSpan }}</span>
          <el-button
            v-if="isBtnShow"
            class="editBtn"
            type="primary"
            @click="saveTime"
          >保存</el-button>
        </li> -->
      </ul>
      <el-dialog
        class="confirmDialog"
        title="视频监控状态"
        :show-close="false"
        :visible.sync="dialogVisible"
        @close="dialogCloseHandle"
        width="640px"
      >
        <span>{{ dialogContent }}</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="dialogConfirmHandle"
          >确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="180px"
        class="demo-dynamic"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.domains"
              :label="'视频监控开放时段' + (index+1)"
              :key="domain.key"
              :prop="'domains.' + index + '.value'"
              :rules="{
      required: true, message: '时间不能为空', trigger: 'blur'
    }"
            >
              <el-time-picker
                :disabled="!isOpen"
                v-model="domain.value"
                @change="timeChange"
                format="HH:mm"
                value-format="HH:mm:00"
                :picker-options="{
              selectableRange: `00:00:00 - ${domain.value1 ? domain.value1 : '23:59:59'}`,
            }"
                placeholder="请选择"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14.5">
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.domains"
              label=""
              :key="domain.key"
              :prop="'domains.' + index + '.value1'"
              :rules="{
      required: true, message: '时间不能为空', trigger: 'blur'
    }"
            >
              <el-time-picker
                :disabled="!isOpen"
                v-model="domain.value1"
                @change="timeChange"
                format="HH:mm"
                value-format="HH:mm:00"
                :picker-options="{
              selectableRange: `${domain.value ? domain.value + ':00' : '00:00:00'} - 23:59:59`,
            }"
                placeholder="请选择"
              >
              </el-time-picker>
              <el-button
                style="    display: contents;"
                @click.prevent="removeDomain(domain)"
                v-if="index!=0"
                :disabled="!isOpen"
              >删除</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('dynamicValidateForm')"
                :disabled="!isOpen"
              >提交</el-button>
              <el-button
                @click.native="addDomain()"
                :disabled="disabled"
                type="success"
              >增加开放时段</el-button>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div
      class="left"
      v-if="!showswitch"
    >
      <div class="ggsjff">学生服务开通情况</div>
      <ul class="topContent">
        <el-table
          :data="tableData"
          style="width: 95%"
          border
        >
          <el-table-column
            prop="className"
            label="班级"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="学生姓名"
          >
          </el-table-column>
          <el-table-column
            prop="isstudy"
            label="就读状态"
            :formatter="formatter"
          >
          </el-table-column>
          <el-table-column
            prop="parentPhone"
            label="家长手机号"
          >
          </el-table-column>
          <el-table-column
            prop="serviceInfo"
            label="服务类型"
          >
          </el-table-column>
          <el-table-column
            prop="monitorNum"
            label="监控授权数量"
          >
          </el-table-column>
          <el-table-column
            prop="vipExpireTime"
            label="服务到期时间"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          class="custom-pagination"
          :page-size.sync="pagination.pageSize"
          :current-page.sync="pagination.currentPage"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="slot,total,sizes,->,prev,pager,next"
          @size-change="handlePageSizeChange"
          @current-change="getPageInfo"
        >
          <span class="el-pagination__total">
            第
            {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}
            条&nbsp;到&nbsp;第
            {{
          pagination.currentPage * pagination.pageSize > pagination.total
            ? pagination.total
            : pagination.currentPage * pagination.pageSize
        }}条
          </span>
        </el-pagination>
      </ul>
      <hr />
    </div>
  </div>
</template>

<script>
import {
  getMonitorInfo,
  updateMonitorFlag,
  updateMonitorTime,
  getvip,
} from "../../api/video-monitor";
import { getschool } from "../../api/highlight-monitor";
import { getUserInfo, showMsgbox } from "../../utils";

export default {
  name: "index",
  data () {
    return {
      showstudet: sessionStorage.getItem('monitorVip') == 1,
      showswitch: sessionStorage.getItem('paymentMethod') == 1,
      showspjk: false,
      disabled: false,
      dynamicValidateForm: {
        domains: [{
          value: '',
          value1: ''
        }],
      },
      authorizedNum1: 0,
      remainNum1: 0,
      expireDate1: "",
      monitorEndTimeStart: "",
      timeSpan: "--:-- - --:--",
      authorizedNum: 0,
      remainNum: 0,
      expireDate: "",
      dialogContent: "当前已有家长开通视频服务，确认关闭？",
      dialogVisible: false,
      isBtnShow: false,
      isOpen: false,
      monitorStartTime: "",
      monitorEndTime: "",
      tableData: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  watch: {
    isOpen (newV, oldV) {
      if (!newV) {
        this.isBtnShow = false;
      }
    },
    monitorStartTime (newV, oldV) {
      if (!newV || newV == "") {
        this.monitorEndTimeStart = "06:00";
        return;
      }
      let arr = newV.split(":");
      if (Number(arr[1]) + 1 >= 60) {
        arr[0] = Number(arr[0]) + 1;
        arr[1] = "00";
      } else {
        arr[1] = Number(arr[1]) + 1;
      }
      this.monitorEndTimeStart = arr.join(":");
    },
  },
  mounted () {
    this.getPageInfo();
  },
  methods: {
    formatter (row, column) {
      if (row.isstudy == 1) {
        return '在读'
      }
      return '退学'
    },
    submitForm (formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.dynamicValidateForm.domains
          var str = ''
          for (let index = 0; index < this.dynamicValidateForm.domains.length; index++) {
            var str = str + this.dynamicValidateForm.domains[index].value + '-' + this.dynamicValidateForm.domains[index].value1 + ',';
          }
          str = str.substr(0, str.length - 1);

          let time = str.split(/-|,/);
          // time.sort(function (a, b) {
          //   return a < b ? -1 : 1
          // });
          var success = 0;
          for (let i = 0; i < time.length - 1; i++) {
            if (time[i] >= time[i + 1]) {
             this.$message({
                  message: "时间段不能重合，后一段时间需要大于前一段时间",
                  type: "error",
                });
              var success = 1;
              break
            }
          }
          if (success == 0) {
            updateMonitorTime({
              monitorOpenPeriod: str,
              schoolId: getUserInfo().schoolId,
            })
              .then((res) => {
                this.isBtnShow = false;
                this.$message({
                  message: "时间段保存成功",
                  type: "success",
                });
              })
              .catch((err) => {
                showMsgbox(err);
              });
          }

        } else {

          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== 0) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
      this.disabled = false;
    },
    addDomain (ev) {
      console.log(ev);
      if (this.dynamicValidateForm.domains.length <= 2) {
        this.dynamicValidateForm.domains.push({
          value: '',
          value1: '',
        });
        if (this.dynamicValidateForm.domains.length == 3) {
          this.disabled = true;
        }
      } else {
        this.disabled = true;
      }


    },
    saveTime () {
      if (
        this.monitorStartTime == "" ||
        !this.monitorStartTime ||
        this.monitorEndTime == "" ||
        !this.monitorEndTime
      ) {
        this.$message("请选择完整的时间段");
      } else {
        updateMonitorTime({
          monitorOpenStartTime: this.monitorStartTime,
          monitorOpenEndTime: this.monitorEndTime,
          schoolId: getUserInfo().schoolId,
        })
          .then((res) => {
            this.isBtnShow = false;
            this.$message({
              message: "时间段保存成功",
              type: "success",
            });
          })
          .catch((err) => {
            showMsgbox(err);
          });
      }
    },
    getPageInfo () {
      getMonitorInfo({
        schoolId: getUserInfo().schoolId,
      })
        .then((res) => {
          this.authorizedNum = res.openAccessNum;
          this.remainNum = res.remainAccessNum;
          this.expireDate = res.monitorExpireDate;
          this.isOpen = Number(res.monitorOpenFlag) ? true : false;
          this.timeSpan = res.monitorOpenStartTime
            ? res.monitorOpenStartTime + " - " + res.monitorOpenEndTime
            : "--:-- - --:--";
          this.monitorStartTime = res.monitorOpenStartTime;
          this.monitorEndTime = res.monitorOpenEndTime;
          this.showspjk = Number(res.monitorVip) ? true : false;
          if (res.monitorOpenPeriod) {
            if (res.monitorOpenPeriod.split(',').length >= 1) {
              this.dynamicValidateForm.domains[0].value = res.monitorOpenPeriod.split('-')[0];
              this.dynamicValidateForm.domains[0].value1 = res.monitorOpenPeriod.split('-')[1].split(',')[0];
            }

            if (res.monitorOpenPeriod.split(',').length >= 2) {
              this.dynamicValidateForm.domains.push({
                value: res.monitorOpenPeriod.split(',')[1].split('-')[0],
                value1: res.monitorOpenPeriod.split(',')[1].split('-')[1],
              });
            }
            if (res.monitorOpenPeriod.split(',').length >= 3) {
              this.dynamicValidateForm.domains.push({
                value: res.monitorOpenPeriod.split(',')[2].split('-')[0],
                value1: res.monitorOpenPeriod.split(',')[2].split('-')[1],
              });
              this.disabled = true;
            }
          }

        })
        .catch((err) => {
          showMsgbox(err);
        });
      getschool({
        schoolId: getUserInfo().schoolId,
      })
        .then((res) => {
          this.expireDate1 = res.highlightExpireDate;
          this.remainNum1 = res.remainHighlightNum;
          this.authorizedNum1 = res.openHighlightNum;

        })
        .catch((err) => {
          showMsgbox(err);
        });
      getvip({
        schoolId: getUserInfo().schoolId,
        pager: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
        },
      })
        .then((res) => {
          this.tableData = res.data.records;
          this.pagination.total = res.data.total;
        })
        .catch((err) => {
          showMsgbox(err);
        });
    },
    dialogCloseHandle () {
      this.dialogVisible = false;
    },
    handlePageSizeChange (val) {
      this.pagination.pageSize = val;
      this.getPageInfo();
    },
    dialogConfirmHandle () {
      updateMonitorFlag({
        monitorOpenFlag: this.isOpen ? 0 : 1,
        schoolId: getUserInfo().schoolId,
      })
        .then((res) => {
          this.dynamicValidateForm = {
            domains: [{
              value: '',
              value1: ''
            }],
          },
            this.getPageInfo();

        })
        .catch((err) => {
          showMsgbox(err);
        });
      // this.isOpen = !this.isOpen;
      //
      // if(!this.isOpen){
      //   //当开关关闭时，重新调用查询信息的接口即可
      //
      // }
      this.dialogVisible = false;
    },
    switchChange (val) {
      this.isOpen = !val;
      // if (this.isBtnShow) {
      //   showMsgbox("请先保存所选择的开放时段");
      // } else {
      if (val) {
        this.dialogContent = "确认打开视频监控？";
      } else {
        let expDate = new Date(this.expireDate);
        let nowDate = new Date();
        let result = Date.parse(expDate) > Date.parse(nowDate);
        if (this.authorizedNum > 0 && result) {
          this.dialogContent = "当前已有家长开通视频服务，是否继续关闭？";
        } else {
          this.dialogContent = "确认关闭视频监控？";
        }
      }
      this.dialogVisible = true;
      // }
    },
    timeChange (val, isStartTime) {
      if (isStartTime) {
        this.monitorEndTime = "";
      }
      this.isBtnShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow-y: auto !important;
}
ul {
  list-style: none;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}
.topContent {
  li {
    display: inline-block;
    margin-right: 50px;
    margin-left: 0;
    padding: 0;
    span {
      color: #ff911d;
    }
  }
}
hr {
  width: 94%;
  margin-left: 40px;
  margin-bottom: 40px;
  border: 1px solid #d4d3d3;
}
.right {
  float: left;
  width: 45%;
  min-width: 800px;
  height: 80vh;
  border: 2px solid #d4d3d3;
  margin: 1rem 2rem;
  .ggsjff {
    height: 4rem;
    background-color: #d4d3d3;
    font-size: 1.5rem;
    line-height: 4rem;
    padding: 1rem;
  }
}
.left {
  float: left;
  width: 45%;
   min-width: 800px;
  height: 80vh;
  border: 2px solid #d4d3d3;
  margin: 1rem 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  .ggsjff {
    height: 4rem;
    background-color: #d4d3d3;
    font-size: 1.5rem;
    line-height: 4rem;
    padding: 1rem;
  }
}
ul {
  list-style: none;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}
.topContent {
  li {
    display: inline-block;
    margin-right: 50px;
    margin-left: 0;
    padding: 0;
    span {
      color: #ff911d;
    }
  }
}
hr {
  width: 94%;
  margin-left: 40px;
  margin-bottom: 40px;
  border: 1px solid #d4d3d3;
}
.bottomContent {
  li {
    margin-bottom: 30px;
    line-height: 36px;
    .editBtn {
      width: 50px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      background: #65a6fd;
      border: none;
      border-radius: 4px;
      padding: 0 11px;
      box-sizing: border-box;
    }
  }
}
</style>
<style lang="scss">
.confirmDialog {
  .el-dialog {
    width: 640px;
    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      background: #ff911d;
      box-sizing: border-box;
      padding: 0 0 0 20px;
      .el-icon-close,
      .el-dialog__title {
        color: white;
        font-weight: 500;
      }
    }
    .el-dialog__body {
      padding: 33px 0;
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      color: #4d555d;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .el-dialog__footer {
      text-align: center;
      .el-button {
        width: 90px;
        height: 36px;
        border-radius: 4px;
        padding: 0;
        & + .el-button {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
