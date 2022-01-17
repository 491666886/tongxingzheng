<template>
<div>
<div  class="header">抗疫应急通行系统</div>
<div  class="dwmc"><c>单位名称：{{dwmc}}</c>
<d>剩余通行证可发数量：{{mum}}</d>
</div>
<div  class="buttojn"   >  <el-upload

              ref="upload"
              :headers="myHeaders"
              action="http://121.36.97.239:8080/user/uploadImg"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
               :data="{ userId: this.userId }"
              :show-file-list="false"
              accept=".jpg,.png,.bmp,.jpeg,.psd"
            >
            
                <el-button
                  class="trigger"
                  slot="trigger"
                >上传单位印章图片</el-button>
              
            </el-upload>   </div>
<div  class="buttojn"   >  <el-button  @click="add()" >新增通行证</el-button></div>


  <!-- Form -->

<el-dialog   width="30%" title="新增通行证" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="车主名" :label-width="formLabelWidth">
      <el-input v-model="form.ownerName" autocomplete="off"></el-input>
    </el-form-item>
  <el-form-item label="车主电话" :label-width="formLabelWidth">
      <el-input v-model="form.ownerPhone" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="车主身份证" :label-width="formLabelWidth">
      <el-input v-model="form.ownerIdNum" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="车牌" :label-width="formLabelWidth">
      <el-input v-model="form.carLicense" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="车辆类型" :label-width="formLabelWidth">
       <el-select v-model="form.carType" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
      <el-form-item label="用途" :label-width="formLabelWidth">
      <el-input v-model="form.purpose" autocomplete="off"></el-input>
    </el-form-item>
      <el-form-item label="权限开始时间" :label-width="formLabelWidth">
         <el-date-picker
           value-format="yyyy-MM-dd"
      v-model="form.startTime"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    </el-form-item>
       </el-form-item>
      <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy-MM-dd"
      v-model="form.endTime"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
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
    <el-button type="primary" @click="xinzeng()">确 定</el-button>
  </div>
</el-dialog>
    <el-table  
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
            <el-table-column
      header-align="center"
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small" class="ckyfzj" > 发证</el-button>
       
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { playVideo, getVideoListm,xinzeng } from "../../api/video";
import { formatFileSize, getUserInfo, showmessagebox } from "../../utils";
export default {
  data() {
    return {
      uploadParams :{},
      userId: sessionStorage.getItem("userid"),
      mum:sessionStorage.getItem("usernum"),
      dwmc:sessionStorage.getItem("username"),
       myHeaders: {
       
        accessToken: sessionStorage.getItem("gardenertoken"),
      },
      options: [
        {
          value: "小型客车",
          label: "小型客车",
        },
        {
          value: "小型货车",
          label: "小型货车",
        },
        {
          value: "中型客车",
          label: "中型客车",
        },
        {
          value: "中型货车",
          label: "中型货车",
        },
        {
          value: "大型客车",
          label: "大型客车",
        },
        {
          value: "大型货车",
          label: "大型货车",
        },
        {
          value: "其他类型车",
          label: "其他类型车",
        },
      ],
      fzdw: "",
      isEdit: false,
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        ownerName: "",
        ownerPhone : "",
        ownerIdNum: "",
        carLicense : "",
        carType : false,
        purpose: [],
        startTime: "",
        endTime: "",
      },
      formLabelWidth: "120px",
      tableData: [],
    };
  },
  mounted() {
    this.getlist();
    
  },
  methods: {
    xinzeng() {
      
     xinzeng(this.form) .then((res) => {
        this.getlist();
         this.dialogFormVisible = false;
        })
        .catch((message) => {
          showmessagebox(message);
        });
    },
    handleBeforeUpload (file) {
     
      const fileTypes = ["image/jpeg", "image/png"];
      const exts = ["jpg", "png", "jpeg"];
      const ext = file.name.split(".").pop();
      const isImg =
        fileTypes.indexOf(file.type) !== -1;
      if (!isImg) {
        showmessagebox("上传只能是jpg或png格式");
      }
      return isImg;
    },
    handleUploadSuccess (res) {
     showmessagebox("上传成功");
    console.log(res)
   
    },
    handleUploadError (err) {
      showmessagebox(err);
    },
    getlist() {
      playVideo({})
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
             departmentName:itm.departmentName,
              cardNum: itm.cardNum,
              endTime:itm.endTime.substring(0, 10),
              permitId:itm.id
            };
          });
          this.dwmc=res[0].departmentName
        })
        .catch((message) => {
          showmessagebox(message);
        });
    },
    handleClick(row) {
      console.log(row)
      var oInput = document.createElement("input");
      oInput.value ="http://121.36.97.239:80/share.html?permitId="+ row.permitId;

      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "证书链接已复制",
      });
    },
    add(){
      this.dialogFormVisible = true;
      // this.isEdit = true;
    },
    check() {},
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
        message: "success",
      });
    },
  },
};
</script>
<style  lang='scss' scoped>
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
.dwmc {
  background-color: cadetblue;
  height: 3rem;
  font-size: 2rem;
  color: white;
  line-height: 3rem;
  c {
    margin-right: 5rem;
  }
}
</style>