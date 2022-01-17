<template>
  <div class="common-container">
    <div class="table-search table-header-action">
      <div class="table-header-action-left">
        <div class="search-item">
          <span class="search-item-label">姓名</span>
          <el-input v-model="search.name"></el-input>
        </div>
        <!-- <div class="search-item">
          <span class="search-item-label">身份证号</span>
          <el-input v-model="search.childCode" />
        </div> -->
        <div class="search-item">
          <span class="search-item-label">在读状态</span>
          <el-select v-model="search.isstudy">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-btns">
          <div
            v-loading="searching"
            class="search-btn-primary search-btn"
            @click="handleSearch"
          >
            搜索
          </div>
          <div
            class="search-btn"
            @click="handleReset"
          >
            条件重置
          </div>
        </div>
      </div>
      <div v-if="showAdd">
        <!--      <div >-->
        <div
          class="table-header-action-btn"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia"></i>
          添加学生
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        label="宝宝ID"
        prop="childCode"
        min-width="120"
      />
      <el-table-column
        label="姓名"
        prop="name"
        min-width="80"
      />
      <el-table-column
        label="性别"
        prop="gender"
        min-width="60"
      />

      <el-table-column
        label="人脸信息"
        prop="face"
        min-width="80"
      >
        <template slot-scope="{ row }">
          <span
            v-if="row.face"
            class="pointer"
            @click="checkFace(row.face)"
          >查看头像</span>
        </template>
      </el-table-column>
      <el-table-column
        label="在读状态"
        prop="isstudy"
        min-width="80"
      />
      <el-table-column
        label="家长身份"
        prop="parentName"
        min-width="80"
      />
      <el-table-column
        label="家长手机号"
        prop="parentPhoneNum"
        min-width="90"
      />
      <el-table-column
        label="监控权限"
        min-width="100"
        prop="authority"
      >
        <template slot-scope="{ row }">
          <el-switch
            :disabled="showswitch"
            v-model="row.authority"
            @change="switchChange($event, row)"
            active-color="#65A6FD"
            inactive-color="#999999"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="高光权限"
        min-width="100"
        prop="hightlightAuthority"
      >
        <template slot-scope="{ row }">
          <el-switch
            :disabled="showswitch"
            v-model="row.highlightAuthority"
            @change="tabHighlightSwitchChange($event, row)"
            active-color="#65A6FD"
            inactive-color="#999999"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        width="200"
      >
        <template slot-scope="{ row }">
          <div class="action-wrapper">
            <div
              class="action"
              @click="handleEdit(row)"
            >
              <i class="iconfont icon-xiugai" />
              修改
            </div>
            <div
              class="action"
              @click="handleDelete(row)"
            >
              <i class="iconfont icon-shanchu" />
              删除
            </div>
          </div>
        </template>
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
      @current-change="getList"
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
    <el-dialog
      :title="dialogTitle"
      :show-close="false"
      custom-class="my-dialog student-info-upload"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="dialogForm"
        :model="dialogForm"
        :rules="dialogRules"
      >
        <el-row :gutter="20">
          <el-col
            :span="12"
            style="height:400px;"
          >
            <el-upload
              ref="upload"
              :headers="myHeaders"
              action="/gourdbaby/gardener/v1/api/teacher/personal/upload/avatar"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :show-file-list="false"
            >
              <div class="avatar-upload">
                <img
                  v-if="!dialogForm.avatar"
                  src="../../../assets/images/placeholder.jpg"
                  class="avatar"
                />
                <img
                  v-else
                  :src="dialogForm.avatar"
                  class="avatar"
                />
                <div
                  class="trigger"
                  slot="trigger"
                >上传人脸信息</div>
              </div>
            </el-upload>
            <span
              v-if="faceid"
              class="faceid"
            >请上传人脸信息</span>
            <div class="hover_wrapper">
              <div
                class="hover_text"
                @mouseover="showHover=true"
                @mouseout="showHover=false"
              ><i class="el-icon-warning"></i></div>

              <div
                class="hover_container"
                v-if="showHover"
              >
                1、 近期正面照，要求五官全部露出，头部至少占照片尺寸的1/3，背景干净，无其它目标人物。</br>
                2、 照片像素大小不应超过1080*1440，格式为jpg或者png,文件大小在20kb—500kb之间。</br>
                3、 照片拍摄角度为平视、正向拍摄，不能进行旋转，画质清晰，光线明亮。

              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <el-form-item
              prop="name"
              label="学生姓名"
            >
              <el-input
                v-model="dialogForm.name"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="gender"
              label="性别"
            >
              <el-select v-model="dialogForm.gender">
                <el-option
                  :value="1"
                  label="男"
                />
                <el-option
                  :value="2"
                  label="女"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="childCode"
              label="宝宝ID"
              v-if="isEdit"
            >
              <el-input
                disabled
                v-model="dialogForm.childCode"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="isEdit"
          >
            <el-form-item
              label="就读状态"
              required
            >
              <el-select
                v-model="dialogForm.isstudy"
                @change="showstudy()"
              >
                <el-option
                  :value="1"
                  label="在读"
                />
                <el-option
                  :value="0"
                  label="退学"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12" style="height: 11px;"></el-col>-->
          <template v-for="(parent, index) in dialogForm.parents">
            <el-col
              :key="index + '1'"
              :span="12"
              style="float: right;"
            >
              <el-form-item
                label="家长手机号"
                :prop="`parents.${index}.phone_num`"
                :rules="dialogRules.parent_phone_num"
                :class="{
                  'last-form-item': index === dialogForm.parents.length - 1,
                }"
              >
                <el-input
                  v-model="dialogForm.parents[index].phone_num"
                  :disabled="dialogForm.recState == 2"
                />
                <i
                  v-if="index > 0"
                  class="iconfont icon-shanchu1 delete-parent"
                  @click="handleDeleteParent(index, parent.id)"
                />
              </el-form-item>
            </el-col>
            <el-col
              :key="index"
              :span="12"
              style="margin-top :20px; float:right;"
              v-if="isEdit"
            >
              <el-form-item
                :prop="`parents.${index}.name`"
                :rules="dialogRules.parent_name"
                :class="{
                  'last-form-item': index === dialogForm.parents.length - 1,
                }"
                label="家长身份"
              >
                <el-input
                  :disabled="true"
                  v-model="dialogForm.parents[index].name"
                />
                <!-- :label="`家长姓名${index + 1}`" -->
                <!--                <el-input-->
                <!--                        v-if="!parent.id"-->
                <!--                        v-model="dialogForm.parents[index].name"-->
                <!--                />-->
                <!--                <span v-else>{{ parent.name }}</span>-->
              </el-form-item>
            </el-col>
          </template>
          <el-col
            :span="12"
            style="margin-top :20px;float:right;"
            v-if="isEdit"
          >
            <el-form-item
              v-if="!showswitch"
              prop="authority"
              label="视频监控权限"
              style="margin-bottom:0;"
            >
              <el-switch
                :disabled="showswitch"
                v-model="dialogForm.authority"
                active-color="#65A6FD"
                inactive-color="#999999"
                @change="formSwitchChange"
              >
              </el-switch>
              <span class="errorMsg">{{ dialogForm.authorityErrorMsg }}</span>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            class="ggqx"
          >
            <el-form-item
              prop="authority"
              label="高光权限"
              v-if="isEdit"
            >
              <el-switch
                :disabled="showswitch"
                v-model="dialogForm.highlightAuthority"
                active-color="#65A6FD"
                inactive-color="#999999"
                @change="formHighlightSwitchChange"
              >
              </el-switch>
              <span class="errorMsg2">{{
                dialogForm.highlightAuthorityErrorMsg
              }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" style="display: flex; margin: 16px 0 0 10px">
            <div
              class="btn-no-border-with-icon color-blue"
              @click="handleAddParent"
            >
              <i class="iconfont icon-tianjia" />
              添加家长信息
            </div>
          </el-col> -->
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          v-loading="isCommitting"
          @click="confirm"
        >
          确 定
        </el-button>
        <el-button
          class="dialog-cancel-btn"
          @click="cancel()"
        >
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="previewDialogVisible"
      width="413px"
      center
    >
      <img
        width="100%"
        class="touxiang"
        :src="previewUrl"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  checkPhoneNum,
  showMsgbox,
  checkIdCardNum,
  getUserInfo,
} from "../../../utils";
import {
  getList,
  queryStudentInfo,
  deleteStudent,
  addStudent,
  editStudent,
  highlightMonitorAuthority,
  monitorAuthority,
} from "../../../api/student";

export default {
  data () {
    return {
      myHeaders: {
        "App-Type": "pc,2.1.0,gardener,browser,h5",
        Authorization: getUserInfo().token,
      },
      showHover: false,
      faceid: false,
      options: [
        {
          value: "1",
          label: "在读",
        },
        {
          value: "0",
          label: "退学",
        },
      ],
      tableData: [],
      showAdd: getUserInfo().class_id,
      showswitch: sessionStorage.getItem('paymentMethod') == '2',
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      search: {
        name: "",
        childCode: "",
        value: "",
      },
      isQuerying: false,
      dialogForm: {
        name: "",
        gender: 1,
        childCode: "",
        avatar: "",
        headImgRelate: "",
        isstudy: "",
        parents: [
          {
            name: "",
            phone_num: "",
          },
        ],
        authority: false,
        highlightAuthority: true,
        highlightAuthorityErrorMsg: "",
      },
      dialogRules: {
        name: [
          {
            required: true,
            message: "学生姓名不能为空",
            trigger: "manual",
          },
        ],
        gender: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "manual",
          },
        ],
        // childCode: [
        //   {
        //     required: true,
        //     message: "号不能为空",
        //     trigger: "manual",
        //   },
        //   {
        //     validator: checkIdCardNum,
        //     trigger: "change",
        //   },
        // ],
        parent_name: [
          {
            // required: true,
            message: "家长身份不能为空",
            trigger: "manual",
          },
        ],
        parent_phone_num: [
          // {
          //   required: true,
          //   message: "家长手机号不能为空",
          //   trigger: "manual",
          // },
          {
            validator: checkPhoneNum,
            trigger: "change",
          },
        ],
      },
      dialogVisible: false,
      previewDialogVisible: false,
      previewUrl: "",
      isEdit: false,
      searching: false,
      isCommitting: false,
      deleteList: [],
      formSwitchVal: true,
    };
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? "学生信息修改" : "添加学生";
    },
  },
  mounted () {
    console.log(getUserInfo().class_id);
    this.getList();
  },
  methods: {
    formHighlightSwitchChange (val) {
      this.formSwitchVal = !val;
      this.dialogForm.highlightAuthority = !val;
      this.getHighMonitorResult(this.dialogForm, val, 'form')
    },
    tabHighlightSwitchChange (e, row) {
      this.tableData[row.index].highlightAuthority = !e;
      this.getHighMonitorResult(row, e);
    },
    getHighMonitorResult (data, authority, mark) {

      highlightMonitorAuthority({
        childId: data.id,
        highlightFlag: data.highlightAuthority ? 0 : 1,
      })
        .then((res) => {

          if (res && res.code != 0) {
            //code为0时正常，不为0时异常
            if (mark == "form") {

              //diaolog表单中的视频监控
              // this.dialogForm.highlightAuthorityErrorMsg = res.msg;
              this.$set(this.dialogForm, 'highlightAuthorityErrorMsg', res.msg)
              console.log(this.dialogForm.highlightAuthorityErrorMsg)
            } else {
              //列表中的监控
              showMsgbox(res.msg);
            }
          } else {
            if (mark == "form") {
              //dialog表单中的视频监控
              this.dialogForm.highlightAuthorityErrorMsg = authority;
            } else {
              //列表中的监控
              this.tableData[data.index].highlightAuthority = authority;
            }
          }
        })
        .catch((err) => {
          showMsgbox(err);
        });
    },
    formSwitchChange (val) {
      this.dialogForm.authority = !val;
      this.getMonitorResult(this.dialogForm, val, "form");
    },
    switchChange (e, row) {
      this.tableData[row.index].authority = !e;
      this.getMonitorResult(row, e);
    },
    getMonitorResult (data, authority, mark) {
      monitorAuthority({
        childId: data.id,
        monitorFlag: data.authority ? 0 : 1,
      })
        .then((res) => {
          // console.log(res)
          if (res && res.code != 0) {
            //code为0时正常，不为0时异常
            if (mark == "form") {
              //diaolog表单中的视频监控
              this.dialogForm.authorityErrorMsg = res.msg;
            } else {
              //列表中的监控
              showMsgbox(res.msg);
            }
          } else {
            if (mark == "form") {
              //dialog表单中的视频监控
              this.dialogForm.authority = authority;
            } else {
              //列表中的监控
              this.tableData[data.index].authority = authority;
            }
          }
        })
        .catch((err) => {
          showMsgbox(err);
        });
    },
    cancel () {
      this.dialogVisible = false;
      this.faceid = false;
      this.handleDialogClosed();
      this.$refs.dialogForm.resetFields();
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.isstudy === "退学") {
        return "warning-row";
      } else {
        return "";
      }
    },
    showstudy () {
      if (this.dialogForm.isstudy == 0) {
        this.$confirm("修改后将不再推送产品服务，确认修改？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "",
          center: true,
        })
          .then(() => { })
          .catch(() => {
            this.dialogForm.isstudy = 1;
          });
      } else if (this.dialogForm.isstudy == 1) {
        this.$confirm("修改后将开启推送产品服务，确认修改？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "",
          center: true,
        })
          .then(() => { })
          .catch(() => {
            this.dialogForm.isstudy = 0;
          });
      }
    },
    getList () {
      this.isQuerying = true;
      getList({
        userId: getUserInfo().id,
        // cardId: this.search.childCode,
        name: this.search.name,
        isstudy: this.search.isstudy,
        pager: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
        },
      })
        .then((res) => {
          this.tableData = res.records.map((itm, index) => {
            return {
              index: index,
              id: itm.id,
              name: itm.name,
              gender: itm.sexValue,
              face: itm.faceImg,
              childCode: itm.childCode,
              authority: Number(itm.monitorFlag) ? true : false,
              highlightAuthority: Number(itm.highlightFlag) ? true : false,
              isstudy: this.mapstudy(itm.isstudy),
              // parentName: this.mapName(itm.parentRelation),
              parentName: itm.relaName,
              // parentPhoneNum: this.mapPhoneNum(itm.parentRelation),
              parentPhoneNum: itm.parentPhone,
            };
          });
          this.pagination.total = res.total;
          this.searching = false;
          this.isQuerying = false;
        })
        .catch((msg) => {
          this.isQuerying = false;
          this.searching = false;
          showMsgbox(msg);
        });
    },
    handlePageSizeChange (val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleAdd () {
      this.isEdit = false;
      this.dialogForm.highlightAuthority = false;
      this.dialogVisible = true;
    },
    handleBeforeUpload (file) {
      const fileTypes = ["image/jpg", "image/png", "image/jpeg"];
      const exts = ["jpg", "png", "jpeg"];
      const ext = file.name.split(".").pop();
      const isImg =
        // fileTypes.indexOf(file.type) !== -1 && exts.indexOf(ext) !== -1;
        fileTypes.indexOf(file.type) !== -1;
      if (!isImg) {
        showMsgbox("上传头像只能是jpg或png格式");
      }
      return isImg;
    },
    handleUploadSuccess (res) {
      this.dialogForm.avatar = res.data.headImg;
      ;
      this.dialogForm.headImgRelate = res.data.headImgRelate;
      this.faceid = false;
    },
    handleUploadError (err) {
      showMsgbox(err);
    },
    mapName (relation) {
      if (relation) {
        return relation
          .split(",")
          .map((item) => {
            return item.split("-")[0];
          })
          .join();
      }
      return "";
    },
    mapstudy (relation) {
      if (relation == 1) {
        return "在读";
      }
      return "退学";
    },
    mapPhoneNum (relation) {
      if (relation) {
        return relation
          .split(",")
          .map((item) => {
            return item.split("-")[1];
          })
          .join();
      }
      return "";
    },
    doConfirm () {
      if (this.isEdit) {
        editStudent({
          // cardId: this.dialogForm.childCode,
          childId: this.dialogForm.id,
          name: this.dialogForm.name,
          sexStr: this.dialogForm.gender == 1 ? "男" : "女",
          faceImg: this.dialogForm.headImgRelate,
          isstudy: this.dialogForm.isstudy,
          parentsPhone: this.dialogForm.parents[0].phone_num,
          // highlightFlag: this.dialogForm.highlightAuthority ? "1" : "0",
        })
          .then(() => {
            this.dialogVisible = false;
            this.isCommitting = false;
            showMsgbox("修改成功", true);
            this.getList();
          })
          .catch((msg) => {
            this.dialogForm.highlightAuthority = this.formSwitchVal;
            this.isCommitting = false;
            showMsgbox(msg);
          });
      } else {
        addStudent({
          // cardId: this.dialogForm.childCode,
          // classId: getUserInfo().class_id,
          // id: this.dialogForm.id,
          name: this.dialogForm.name,
          // number: this.dialogForm.sno,
          sexStr: this.dialogForm.gender == 1 ? "男" : "女",
          parentsPhone: this.dialogForm.parents[0].phone_num,
          faceImg: this.dialogForm.headImgRelate,
          highlightFlag: this.dialogForm.highlightAuthority ? "1" : "0",
          // userId: getUserInfo().id,
          // headImgRelate: this.dialogForm.headImgRelate,
          // newParentInfoList: this.dialogForm.parents.map((item) => {
          //   return {
          //     userNickName: item.name,
          //     phone: item.phone_num,
          //   };
          // }),
        })
          .then(() => {
            this.dialogVisible = false;
            this.isCommitting = false;
            showMsgbox("添加成功", true);
            this.getList();
          })
          .catch((msg) => {
            this.isCommitting = false;
            showMsgbox(msg);
          });
      }
    },
    confirm () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.dialogForm.avatar === "") {
            this.faceid = true;
          } else {
            this.isCommitting = true;
            this.doConfirm();

            // checkParentPhoneNum({
            //   parentInfoList: this.dialogForm.parents.map((item) => {
            //     return {
            //       userNickName: item.name,
            //       phone: item.phone_num,
            //     };
            //   }),
            // })
            //   .then(() => {
            //     this.doConfirm();
            //     // location.reload();
            //   })
            //   .catch((msg) => {
            //     this.$confirm(msg, "提示")
            //       .then(() => {
            //         this.doConfirm();
            //       })
            //       .catch(() => {
            //         this.isCommitting = false;
            //       });
            //   });
          }
        }
      });
    },
    handleDialogClosed () {
      this.$refs.dialogForm.clearValidate();
      this.dialogForm = {
        avatar: "",
        gender: 1,
        highlightAuthority: true,
        parents: [
          {
            name: "",
            phone_num: "",
          },
        ],
      };
      // this.dialogForm = {
      //   name: "",
      //   gender: 1,
      //   childCode: "",
      //   sno: "",
      //   avatar: "",
      //   headImgRelate: "",
      //   parents: [
      //     {
      //       name: "",
      //       phone_num: "",
      //     },
      //   ],
      // };
      this.deleteList = [];
    },
    handleAddParent () {
      if (this.dialogForm.parents.length < 5) {
        this.dialogForm.parents.push({
          name: "",
          phone_num: "",
        });
      } else {
        this.$alert("最多添加到5个家长", "提示", {
          type: "warning",
        });
      }
    },
    handleDeleteParent (idx, id) {
      if (this.dialogForm.parents.length <= 1) {
        this.$alert("至少要有1名家长", "提示", {
          type: "warning",
        });
      } else {
        this.dialogForm.parents.splice(idx, 1);
        if (id) {
          this.deleteList.push(id);
        }
      }
    },
    checkFace (face) {
      this.previewUrl = face;
      this.previewDialogVisible = true;
    },
    handleEdit (row) {
      this.isEdit = true;
      // this.dialogVisible = true;   //测完把这句话删掉，把下面的注释打开

      queryStudentInfo({
        childId: row.id,
      })
        .then((res) => {
          this.dialogForm = {
            id: row.id,
            name: res.name,
            gender: res.sexStr,
            childCode: res.childCode,
            isstudy: res.isstudy,
            faceImg: res.faceImg,
            avatar: res.faceImgAbsolute,
            recState: res.recState, // 0 录入状态 1 确认中 2 确认完成 3 待修改
            // headImgRelate: "",
            parents: [
              {
                name: res.rname,
                phone_num: res.parentInfo == null ? "" : res.parentInfo.phone,
                id: res.parentInfo == null ? "" : res.parentInfo.id,
              },
            ],
            authority: Number(res.monitorFlag) ? true : false,
            highlightAuthority: Number(res.highlightFlag) ? true : false,
            authorityErrorMsg: "",
            // authority:{
            //   flag:Number(res.monitorFlag)?true:false,
            //   errorMsg:''
            // }
          };
          this.dialogVisible = true;
        })
        .catch((err) => {
          ;
          showMsgbox("查询学生信息出错");
        });
    },
    handleDelete (row) {
      this.$confirm(`确认删除${row.name}学生的信息？`, "学生信息删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteStudent({
            childId: row.id,
          })
            .then(() => {
              showMsgbox("删除成功", true);
              this.getList();
            })
            .catch(() => {
              showMsgbox("删除失败");
            });
        })
        .catch(() => { });
    },
    handleSearch () {
      this.searching = true;
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
      };
      this.getList();
    },
    handleReset () {
      this.search = {
        name: "",
        isstudy: "",
        childCode: "",
      };
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
      };
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../style/main';
.ggqx {
  margin-top: 20px;
  margin-left: 19rem;
}
.hover_wrapper {
  position: relative;

  .hover_text {
    float: right;
    margin-right: 3rem;
  }
  .btn {
    width: 24px;
    height: 24px;
    border: 1px solid #ccc;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
    position: relative;
    cursor: pointer;
  }
  .hover_container {
    width: 500px;
    height: 200px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: left;
    line-height: 30px;
    position: absolute;
    left: 0px;
    bottom: -95px;
    z-index: 99;
    background-color: white;
    transform: translateY(-50%);
  }
}
.form {
  margin-top: 30px;
}
.delete-parent {
  position: absolute;
  right: -19px;
  font-size: 14px;
  color: $red;
  cursor: pointer;
}
.touxiang {
  max-height: 626px;
}
.faceid {
  color: red;
  text-align: center;
  margin: 80px;
}
.errorMsg {
  font-size: 12px;
  font-weight: 400;
  color: #ff5555;
}
.errorMsg2 {
  font-size: 12px;
  font-weight: 400;
  color: #ff5555;
}
.avatar {
  width: 200px !important;
  height: 280px !important;
}
.avatar-upload {
  background: none;
}
.trigger {
  padding: 5px 23px !important;
  box-sizing: border-box !important;
  margin-top: 20px !important;
}
</style>
<style>
.el-table .warning-row {
  background: #f5f5f5;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
