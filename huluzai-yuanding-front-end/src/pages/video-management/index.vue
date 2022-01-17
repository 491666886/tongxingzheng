<template>
<div>
<div  class="header">抗疫应急通行系统</div>
<div  class="buttojn"   >  <el-button  @click="add()" >新增发证单位</el-button></div>
<div  class="buttojn"   >  <el-button  @click="check()" >查看全部通行证</el-button></div>


  <!-- Form -->

<el-dialog   width="30%" title="新增单位" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="单位名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
  <el-form-item label="授权数量" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
     <!-- <el-form-item label="验证码" :label-width="formLabelWidth">
      <el-input   class="code" v-model="form.code" autocomplete="off" :disabled="true" ></el-input>
         <el-button
                  v-if="isEdit"
                  class="reset"
                  @click="repassword"
                >
                  生成验证码
                </el-button>
    </el-form-item> -->
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
  <el-table

:header-cell-style="{'text-align':'center'}" 
:cell-style="{'text-align':'center'}"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      header-align="center"
      fixed
      prop="name"
      label="发证单位"
    >
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="currentPermitNum"
      label="已发有效通行证数量"
      >
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="permitMaxNum"
      label="剩余可发通行证数量"
      >
       <template slot-scope="scope">
           <span v-if="scope.row.permitMaxNum != null && scope.row.currentPermitNum != null">{{scope.row.permitMaxNum - scope.row.currentPermitNum}}</span>
         </template>
    </el-table-column>
    <el-table-column
      header-align="center"
      prop="passport"
      label="登陆验证码"
      >
    </el-table-column>
  
    <el-table-column
      header-align="center"
      prop="zip"
      label="邮编"
      
    </el-table-column>
    <el-table-column
      header-align="center"
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small" class="ckyfzj" > 查看已发证件</el-button>
        <el-button type="text" size="small">移除发证单位</el-button>
         <el-button type="text" size="small" @click="copycode(scope.row)" >点击复制验证码</el-button>
      </template>
    </el-table-column>

  </el-table>
    <el-table  
    v-if="isEdit"
  width="100%"
:header-cell-style="{'text-align':'center'}" 
:cell-style="{'text-align':'center'}" :data="gridData"
style="margin-top:5rem"
>
<el-table-column property="departmentName" label="发证单位" ></el-table-column>
    <el-table-column property="ownerName" label="姓名" width="150"></el-table-column>
    <el-table-column property="ownerPhone" label="手机号" ></el-table-column>
    <el-table-column property="ownerIdNum" label="身份证"></el-table-column>
     <el-table-column property="carLicense" label="车牌号"></el-table-column>
      <el-table-column property="carType" label="车辆类型"></el-table-column>
       <el-table-column property="purpose" label="用途"></el-table-column>
        <el-table-column property="startTime" label="通行证开始时间"></el-table-column>
        <el-table-column property="endTime" label="通行证有效时间"></el-table-column>
        <el-table-column property="cardNum" label="通行证编号"></el-table-column>
  </el-table>
  </div>
</template>

<script>
import { getVideoInfo, getVideoList } from "../../api/video";
import { formatFileSize, getUserInfo, showMsgbox } from "../../utils";
export default {
  data() {
    return {
      fzdw: "",
      isEdit: false,
      gridData: [
        
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      tableData: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      getVideoInfo({})
        .then((res) => {
          console.log(res);
          this.tableData = res;
        })
        .catch((msg) => {
          showMsgbox(msg);
        });
    },
    handleClick(row) {
      // this.fzdw = "发证单位:  " + row.name;
      // (this.dialogTableVisible = true), console.log(row);
      this.isEdit = true;
      getVideoList({
        IntegerdepartmentId:row.id
      })
        .then((res) => {
          console.log(res);
          this.gridData = res.map((itm) => {
            return {
              ownerName: itm.ownerName,
              ownerPhone: itm.ownerPhone,
              ownerIdNum: itm.ownerIdNum,
              carLicense: itm.carLicense,
              carType: itm.carType,
              purpose: itm.purpose,
              startTime: itm.startTime.substring(0, 10),
               endTime:itm.endTime.substring(0, 10),
             departmentName:itm.departmentName,
              cardNum: itm.cardNum,
            };
          });
        })
        .catch((msg) => {
          showMsgbox(msg);
        });
    },
    add() {
      console.log("213");
      this.dialogFormVisible = true;
      this.isEdit = true;
    },
    check() {
      this.handleClick()
    },
    copycode(row) {
      console.log(row);

      var oInput = document.createElement("input");
      oInput.value = row.code;

      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "已复制",
      });
    },
  },
};
</script>
<style scoped>
.header {
  background-color: cadetblue;
  height: 6rem;
  text-align: center;
  font-size: 3rem;
  line-height: 6rem;
  color: white;
}
.buttojn {
  float: right;
  margin: 1rem;
}
.ckyfzj {
  margin-right: 20px;
}
.code {
  width: 180px;
}
</style>