<template>
  <div class="common-container">
    <div class="table-search table-header-action">
      <div class="table-header-action-left">
        <div class="search-item">
          <span class="search-item-label">教师名称</span>
          <el-input v-model="search.name" />
        </div>
        <div class="search-item">
          <span class="search-item-label">教师手机号</span>
          <el-input v-model="search.phone_num" />
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
      <div>
        <div
          class="table-header-action-btn"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia" />
          添加教师
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="isQuerying"
      border
    >
      <el-table-column
        label="序号"
        width="80"
      >
        <template slot-scope="{ $index }">
          {{ (pagination.currentPage-1) * pagination.pageSize + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        prop="phone_num"
        min-width="120"
      />
      <el-table-column
        label="教师姓名"
        prop="name"
        min-width="120"
      />

      <el-table-column
        label="教师所属班级"
        prop="className"
        min-width="80"
      />
      <el-table-column
        label="管理"
        width="200"
      >
        <template slot-scope="{row}">
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
      layout="slot,total,sizes,->,prev,pager,next"
      :page-sizes="[10,20,50]"
      @size-change="handlePageSizeChange"
      @current-change="getList"
      @prev-click="getList"
      @next-click="getList"
    >
      <span class="el-pagination__total">
        第
        {{ (pagination.currentPage-1) * pagination.pageSize + 1 }}
        条&nbsp;到&nbsp;第
        {{ pagination.currentPage * pagination.pageSize > pagination.total?pagination.total:pagination.currentPage * pagination.pageSize }}条
      </span>
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      :show-close="false"
      custom-class="my-dialog"
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
        <el-row :gutter="26">
          <el-col :span="12">
            <el-form-item
              prop="name"
              label="教师姓名"
            >
              <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="phone_num"
              label="手机号"
            >
              <el-input v-model="dialogForm.phone_num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师所属班级">
              <span>{{ dialogForm.className}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="pwdLabel">
              <div class="pwd">

                <el-input
                  v-model="dialogForm.password"
                  disabled
                />
                <div
                  v-if="isEdit"
                  class="reset common-btn"
                  @click="resetPassword"
                >
                  重置
                </div>
              </div>
            </el-form-item>
          </el-col>

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
          @click="dialogVisible = false"
        >
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  checkPhoneNum,
  getUserInfo,
  showMsgbox,
  Rsa
} from '../../utils';
import {
  addTeacher,
  editTeacher,
  getTeacher,
  getList,
  deleteTeacher
} from '../../api/kindergarten/teacher-m';

export default {
  data () {
    return {
      tableData: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      search: {
        name: '',
        phone_num: '',
      },
      dialogForm: {
        id: '',
        name: '',
        phone_num: '',
        password: '',
        className: '',
        grade: '',
        sysUserId: ''
      },
      dialogRules: {
        name: [{
          required: true,
          message: '教师姓名不能为空',
          trigger: 'manual'
        }],
        phone_num: [{
          required: true,
          message: '手机号不能为空',
          trigger: 'manual'
        }, {
          validator: checkPhoneNum,
          trigger: 'manual'
        }]
      },
      dialogVisible: false,
      isQuerying: false,
      searching: false,
      isCommitting: false,
      isEdit: false,
    };
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '教师信息修改' : '添加教师';
    },
    pwdLabel () {
      return this.isEdit ? '密码' : '初始密码	';
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    getList () {
      this.isQuerying = true;
      getList({
        schoolId: getUserInfo().schoolId,
        name: this.search.name,
        mobile: this.search.phone_num,
        pager: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage
        }
      }).then((res) => {
        this.tableData = res.records.map(itm => {
          return {
            id: itm.id,
            phone_num: itm.mobile,

            className: itm.className,
            name: itm.name
          }
        });
        this.pagination.total = res.total;
        this.searching = false;
        this.isQuerying = false;
      }).catch((msg) => {
        this.isQuerying = false;
        this.searching = false;
        showMsgbox(msg);
      })
    },
    handlePageSizeChange (val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleSearch () {
      this.searching = true;
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
      }
      this.getList();
    },
    handleAdd () {
      this.createdPassword();
      this.isEdit = false;
      this.dialogVisible = true;

    },
    createdPassword () {
      //  
      var password = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
        "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
        "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
        "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
      ];
      var str = "";
      for (var i = 0; i < 8; i++) {
        str += password[Math.floor(Math.random() * password.length)];
      }
      str += Math.floor(Math.random() * 10)
      this.$set(this.dialogForm, "password", str);
    },
    confirm () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.isCommitting = true;
          if (this.isEdit) {
            editTeacher({
              id: this.dialogForm.id,
              mobile: this.dialogForm.phone_num,
              password: this.dialogForm.password == '' ? '' : Rsa(this.dialogForm.password),
              name: this.dialogForm.name,
              schoolId: getUserInfo().schoolId,
              sysUserId: this.dialogForm.sysUserId,
            })
              .then(() => {
                this.dialogVisible = false;
                this.isCommitting = false;
                showMsgbox('修改成功', true);
                this.getList();
              }).catch((msg) => {
                this.isCommitting = false;
                showMsgbox(msg);
              })
          } else {
            addTeacher({
              mobile: this.dialogForm.phone_num,
              name: this.dialogForm.name,
              schoolId: getUserInfo().schoolId,
              regionId: sessionStorage.getItem("dataLakeId"),
              password: Rsa(this.dialogForm.password)
            })
              .then(() => {
                this.dialogVisible = false;
                this.isCommitting = false;
                showMsgbox('添加成功', true);
                this.getList();
              }).catch((msg) => {
                this.isCommitting = false;
                showMsgbox(msg);
              })
          }
        }
      })
    },
    handleDialogClosed () {
      this.$refs.dialogForm.clearValidate();
      this.dialogForm = {
        id: '',
        name: '',
        phone_num: '',
        password: '000000',
        className: '',
        grade: '',
        sysUserId: ''
      }
    },
    handleEdit (row) {
      this.isEdit = true;
      getTeacher({
        id: row.id
      }).then((res) => {
        this.dialogForm = {
          id: res.id,
          name: res.name,
          phone_num: res.mobile,
          className: res.className,
          grade: res.grade,
          sysUserId: res.sysUserId,
          password:'',
        }
        this.dialogVisible = true;
      }).catch(() => {
        showMsgbox('查询班级出错');
      })
    },
    handleDelete (row) {
      this.$confirm(`确认删除${row.name}教师的信息？`, '教师信息删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteTeacher({
          id: row.id
        }).then(() => {
          showMsgbox('删除成功', true);
          this.getList();
        }).catch(() => {
          showMsgbox('删除失败');
        })
      }).catch(() => { });
    },
    handleReset () {
      this.search = {
        name: '',
        phone_num: ''
      };
      this.pagination = {
        ...this.pagination,
        currentPage: 1,
      }
      this.getList();
    },
    resetPassword () {
      this.$confirm('确定要重置密码吗？', '提示', {
        type: 'info'
      }).then(() => {
        this.createdPassword();
        this.$forceUpdate()
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../style/main';
.pwd {
  display: flex;
  align-items: center;
}
.reset {
  width: 50px;
  height: 24px;
  margin-left: 9px;
  border-radius: 4px;
  background-color: $blue;
  color: #fff;
}
</style>

