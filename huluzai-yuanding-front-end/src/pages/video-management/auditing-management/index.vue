<template>
  <div class="common-container">
    <div class="table-search table-header-action">
      <div class="table-header-action-left">
        <div class="search-item">
          <span class="search-item-label">视频分类</span>
          <el-select
            v-model="search.video_type"
            clearable
          >
            <el-option
              v-for="option in video_type_options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </div>
        <div class="search-item">
          <span class="search-item-label">视频名称</span>
          <el-input v-model="search.video_name" />
        </div>

        <div class="search-item">
          <span class="search-item-label">访问用户</span>
          <el-select
            v-model="search.visitor"
            clearable
          >
            <el-option
              v-for="option in visitor_options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </div>
        <div
          v-if="tabPosition !== 'todo'"
          class="search-item"
        >
          <span class="search-item-label">审核操作人</span>
          <el-select
            v-model="search.operator"
            clearable
          >
            <el-option
              v-for="option in operator_options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </div>
        <div
          v-if="tabPosition !== 'todo'"
          class="search-item"
        >
          <span class="search-item-label">审核状态</span>
          <el-select
            v-model="search.checkStatus"
            clearable
          >
            <el-option
              v-for="option in checkStatus_options"
              :key="option.code"
              :value="option.code"
              :label="option.value"
            />
          </el-select>
        </div>
        <div class="search-btns">
          <div
            class="search-btn-primary search-btn"
            v-loading="searching"
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
    </div>
    <el-radio-group
      @change="reget()"
      v-model="tabPosition"
      style="margin-bottom: 30px;"
    >
      <el-badge
        v-if="todoCount !== 0"
        :value="todoCount"
        class="badge"
      >
        <el-radio-button label="todo">待审核</el-radio-button>
      </el-badge>
      <el-radio-button
        v-if="todoCount === 0"
        label="todo"
      >待审核</el-radio-button>
      <el-radio-button label="checked">已审核</el-radio-button>
      <el-radio-button label="all"> &nbsp 全部 &nbsp</el-radio-button>
    </el-radio-group>
    <el-table
      v-if="tabPosition === 'todo'"
      :data="tableData"
      v-loading="isQuerying"
      border
      empty-text="暂无待审核视频哦"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="视频名称"
        prop="video_name"
      />
      <el-table-column
        label="所属班级"
        prop="className"
      />
      <el-table-column
        label="视频分类"
        prop="video_type"
      />

      <el-table-column
        label="视频生成时间"
        prop="record_time"
      />

      <el-table-column
        label="访问用户"
        prop="visitor"
        show-overflow-tooltip
      />
      <el-table-column
        label="审核时间"
        prop="checkVideoTime"
      />
      <el-table-column
        label="审核状态"
        prop="checkStatus"
      />
      <el-table-column
        label="审核操作人"
        prop="checkUserName"
      />
      <el-table-column label="管理">
        <template slot-scope="{ row }">
          <div class="action-wrapper">
            <div
              class="action"
              @click="shenhe(row)"
            >
              <i class="el-icon-s-check" />
              审核
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="快捷审核"
        width="260"
      >
        <template slot-scope="{ row }">
          <div class="action-wrapper">
            <el-popconfirm
              title="确定通过吗？"
              @onConfirm="pass(row)"
            >
              <el-button
                slot="reference"
                type="success"
                plain
              >通过</el-button>
            </el-popconfirm>

            <!-- <div class="action" @click="pass(row)">
              <i class="iconfont icon-xiugai" />
              通过
            </div> -->
            <el-popconfirm
              title="确定不通过吗？"
              @onConfirm="nopass(row)"
            >
              <el-button
                slot="reference"
                type="danger"
                plain
              >不通过</el-button>
            </el-popconfirm>
            <!-- <div
             
              class="action"
              @click="nopass(row)"
            >
              <i class="iconfont icon-video-control" />
              不通过
            </div> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tabPosition !== 'todo'"
      :data="tableData"
      v-loading="isQuerying"
      border
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="视频名称"
        prop="video_name"
      />
      <el-table-column
        label="所属班级"
        prop="className"
      />
      <el-table-column
        label="视频分类"
        prop="video_type"
      />
      <el-table-column
        label="视频生成时间"
        prop="record_time"
      />
      <el-table-column
        label="访问用户"
        prop="visitor"
        show-overflow-tooltip
      />
      <el-table-column
        label="审核时间"
        prop="checkVideoTime"
      />
      <el-table-column
        label="审核状态"
        prop="checkStatus"
      />
      <el-table-column
        label="审核操作人"
        prop="checkUserName"
      />

      <el-table-column
        label="管理"
        width="260"
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
              @click="handlePlay(row)"
            >
              <i class="iconfont icon-video-control" />
              播放
            </div>
            <div
              v-if="row.checkStatus === '未审核'"
              class="action"
              @click="shenhe(row)"
            >
              <i class="el-icon-s-check" />
              审核
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
      :page-sizes="[10, 20, 50]"
      @size-change="handlePageSizeChange"
      @current-change="getList"
      @prev-click="getList"
      @next-click="getList"
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
      custom-class="my-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleDialogClosed"
    >
      <el-upload
        v-if="!isEdit"
        :disabled="uploading"
        action="/gourdbaby/gardener/v1/api/teacher/video/upload"
        :before-upload="handleBeforeUpload"
        :on-progress="handleUploadOnProgress"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :show-file-list="false"
        :headers="myHeaders"
      >
        <div class="upload-area">
          <div class="upload-inner">
            <div
              v-if="!video.name"
              class="choose-video"
              slot="trigger"
            >
              选择视频文件
            </div>
            <div
              v-else
              class="video-file"
            >
              <div class="video-file-top">
                <i
                  v-if="!isEdit"
                  class="iconfont icon-shipinwenjian01"
                />
                <img
                  v-else
                  width="50px"
                  height="36px"
                  :src="dialogForm.videoImg"
                />
                {{ video.name }}({{ video.size }})
              </div>
              <div
                class="video-file-bottom"
                v-if="upload_show_tips"
              >
                <el-progress
                  v-if="uploading"
                  :percentage="uploadProgress"
                  color="#65A6FD"
                />
                <i
                  v-if="uploadSuccess"
                  class="iconfont icon-chenggong upload-success"
                />
                <span
                  v-if="uploadSuccess"
                  class="upload-success"
                >上传完成</span>
              </div>
            </div>
          </div>
        </div>
      </el-upload>
      <div
        v-else
        class="upload-area"
      >
        <div class="upload-inner">
          <div class="video-file">
            <div class="video-file-top">
              <img
                width="50px"
                height="36px"
                :src="dialogForm.videoImg"
              />
              {{ video.name }}({{ video.size }})
            </div>
          </div>
        </div>
      </div>
      <el-form
        class="form"
        label-width="80px"
        ref="dialogForm"
        :model="dialogForm"
        :rules="dialogRules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              ref="videoName"
              prop="video_name"
              label="视频名称"
               
            >
              <el-input
               :disabled="true"
                v-model="dialogForm.video_name"
                @focus="handleFocus"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="video_type"
              label="视频分类"
            >
              <el-select
                v-model="dialogForm.video_type"
                  :disabled="true"
              >
                <el-option
                  v-for="option in teacherCategoryList"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="visible_role"
              class="last-form-item"
              label="可见名单"
            >
              <el-select
                :value="dialogForm.visible_role"
                collapse-tags
                multiple
                @clear="handleVisibleRoleClear"
              >
                <el-option value="">
                  <el-checkbox
                    :indeterminate="checkboxIndeterminate"
                    v-model="checkAll"
                    @change="handleAllVisitorOptionChange"
                  >
                    全部
                  </el-checkbox>
                </el-option>
                <el-option
                  v-for="option in choosableVisitor_options"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                >
                  <el-checkbox
                    v-model="option.checked"
                    @change="handleVisitorOptionChange"
                  >
                    {{ option.label }}
                  </el-checkbox>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="record_time"
              class="last-form-item"
              label="录制日期"
            >
              <el-date-picker
                v-model="dialogForm.record_time"
                value-format="yyyy-MM-dd"
              />
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
    <el-dialog
      :visible.sync="video_visible"
      @closed="handleVideoClosed"
    >
      <video
        v-if="video_url"
        ref="video"
        width="100%"
        height="100%"
      >
        <source
          :src="video_url"
          type="video/mp4"
        />
      </video>
    </el-dialog>
    <el-dialog
      title="视频审核"
      :visible.sync="centerDialogVisible"
      :show-close="false"
      custom-class="my-dialog1"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleVideoClosed"
    >
      <video
        v-if="video_url"
        ref="video1"
        width="100%"
        height="100%"
      >
        <source
          :src="video_url"
          type="video/mp4"
        />
      </video>
      <div style="width =100%">
        <span class="ghj">所属班级 ： {{ dialogForm.className }}</span>
        <span class="ghj">录制时间 ： {{ dialogForm.record_time }}</span>
      </div>

      <el-form
        class="shenhe"
        label-width="80px"
        ref="dialogForm"
        :model="dialogForm"
        :rules="dialogRules1"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              ref="videoName"
              prop="video_name"
              label="视频名称"
            >
              <el-input
                :disabled="true"
                v-model="dialogForm.video_name"
                @focus="handleFocus"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="video_type"
              label="视频分类"
            >
              <el-select
                v-model="dialogForm.video_type"
                :disabled="true"
              >
                <el-option
                  v-for="option in teacherCategoryList"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="visible_role"
              class="last-form-item"
              label="可见名单"
            >
              <el-select
                :value="dialogForm.visible_role"
                collapse-tags
                multiple
                @clear="handleVisibleRoleClear"
              >
                <el-option value="">
                  <el-checkbox
                    :indeterminate="checkboxIndeterminate"
                    v-model="checkAll"
                    @change="handleAllVisitorOptionChange"
                  >
                    全部
                  </el-checkbox>
                </el-option>
                <el-option
                  v-for="option in choosableVisitor_options"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                >
                  <el-checkbox
                    v-model="option.checked"
                    @change="handleVisitorOptionChange"
                  >
                    {{ option.label }}
                  </el-checkbox>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="success"
          plain
          @click="addcheckStatus()"
        >通过</el-button>
        <el-button
          type="danger"
          plain
          @click="uncheckStatus()"
        >不通过</el-button>
        <el-button
          type="text"
          @click="centerDialogVisible = false"
        >以后再说</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVideoInfo,
  getVideoList,
  getVideoSearchOptions,
  addVideoInfo,
  shenhe,
  playVideo,
  editVideoInfo,
  checkVideoName,
} from "../../../api/auditing";
import { formatFileSize, getUserInfo, showMsgbox } from "../../../utils";

export default {
  data () {
    return {
      myHeaders: {
        "App-Type": "pc,2.1.0,gardener,browser,h5",
        Authorization: getUserInfo().token,
      },
      checkStatus: "",
      centerDialogVisible: false,
      tabPosition: "todo",
      todoCount: "",
      tableData: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      checkStatus_options: [
        {
          value: "待审核",
          code: 0,
        },
        {
          value: "通过",
          code: 1,
        },
        {
          value: "未通过",
          code: 2,
        },
      ],
      search: {
        video_type: "",
        video_name: "",
        operator: "",
        visitor: "",
        checkUserid: "",
        checkStatus: "",
      },
      searching: false,
      video_type_options: [],
      teacherCategoryList: [],
      operator_options: [],
      visitor_options: [],
      choosableVisitor_options: [],
      checkboxIndeterminate: false,
      checkAll: false,
      dialogForm: {
        video_name: "",
        video_type: "",
        visible_role: [],
        record_time: "",
        videoRelateUrl: "",
        videoRelateImg: "",
      },
      dialogRules: {
        video_name: [
          {
            required: true,
            message: "视频名称不能为空",
            trigger: "manual",
          },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              checkVideoName({
                videoId: this.dialogForm.videoId,
                videoTitle: value,
                userId: getUserInfo().id,
                category: this.dialogForm.video_type,
              })
                .then(() => {
                  callback();
                })
                .catch((msg) => {
                  callback(new Error(msg));
                });
            },
            trigger: "manual",
          },
        ],
        video_type: [
          {
            required: true,
            message: "视频分类不能为空",
            trigger: "manual",
          },
        ],
        visible_role: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.dialogForm.visible_role.length === 0) {
                callback(new Error("可见名单不能为空"));
              } else {
                callback();
              }
            },
            trigger: "manual",
          },
        ],
        record_time: [
          {
            required: true,
            message: "录制日期不能为空",
            trigger: "manual",
          },
        ],
      },
      dialogRules1: {
        video_name: [
          {
            required: true,
            message: "视频名称不能为空",
            trigger: "manual",
          },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        video_type: [
          {
            required: true,
            message: "视频分类不能为空",
            trigger: "manual",
          },
        ],
        visible_role: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.dialogForm.visible_role.length === 0) {
                callback(new Error("可见名单不能为空"));
              } else {
                callback();
              }
            },
            trigger: "manual",
          },
        ],
      },
      dialogVisible: false,
      uploadProgress: 0,
      video_visible: false,
      video_url: "",
      isEdit: false,
      video: {
        name: "",
        size: "",
      },
      uploading: false,
      uploadSuccess: false,
      upload_show_tips: false,
      isCommitting: false,
      isQuerying: false,
    };
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? "视频信息修改" : "上传视频";
    },
  },
  mounted () {
    this.loadData();
  },
  methods: {
    puttime (value) {
      if (value !== null) {
        return value.substring(0, 10);
      }
    },
    pass (row) {
      shenhe({
        checkResult: 1,
        userId: getUserInfo().id,
        videoId: row.videoId,
        videoTitle: row.video_name,
        category: row.video_num,

        childList: row.childList,
      })
        .then(() => {
          showMsgbox("审核视频成功", true);
          this.isCommitting = false;
          this.centerDialogVisible = false;
          this.getList();
        })
        .catch((msg) => {
          showMsgbox(msg);
          this.isCommitting = false;
        });
    },
    nopass (row) {
      shenhe({
        checkResult: 2,
        userId: getUserInfo().id,
        videoId: row.videoId,
        videoTitle: row.video_name,
        category: row.video_num,

        childList: row.childList,
      })
        .then(() => {
          showMsgbox("审核视频成功", true);
          this.isCommitting = false;
          this.centerDialogVisible = false;
          this.getList();
        })
        .catch((msg) => {
          showMsgbox(msg);
          this.isCommitting = false;
        });
    },
    cheeck (value) {
      switch (true) {
        case value == 2:
          return "未通过";
          break;
        case value == 1:
          return "通过";
          break;
        case value == 11:
          return "通过";
          break;
        case value == 0:
          return "未审核";
          break;
        default:
          return "审核失败";
          break;
      }
    },
    addcheckStatus () {
      this.checkStatus = 1;

      this.shenhevideo();
    },
    uncheckStatus () {
      this.checkStatus = 2;

      this.shenhevideo();
    },
    shenhe (row) {
      this.centerDialogVisible = true;
      this.video_url = row.videoUrl + "?authorization=" + getUserInfo().token;
      this.$nextTick(() => {
        this.$refs.video1.play();
        playVideo({
          videoId: row.videoId,
        })
          .then(() => { })
          .catch((msg) => {
            showMsgbox(msg);
          });
      });
      getVideoInfo({
        videoId: row.videoId,
        id: getUserInfo().id,
      })
        .then((res) => {
          this.dialogForm = {
            videoId: res.videoId,
            video_name: res.videoTitle,
            className: res.className,
            videoUrl: res.videoUrl,
            videoImg: res.videoImg + '?authorization=' + getUserInfo().token,
            video_type: res.category,
            record_time: this.puttime(res.recordTime),
            videoRelateUrl: "",
            videoRelateImg: "",
          };
          this.choosableVisitor_options = this.choosableVisitor_options.map(
            (item) => {
              return {
                ...item,
                checked: res.childList.some((itm) => itm.id === item.value),
              };
            }
          );
          const checked = this.choosableVisitor_options.filter(
            (itm) => itm.checked
          );
          this.dialogForm.visible_role = checked.map((itm) => itm.value);
          const checkedLength = checked.length;
          const allLength = this.choosableVisitor_options.length;
          this.checkboxIndeterminate =
            checkedLength > 0 && checkedLength < allLength;
          this.checkAll = allLength === checkedLength;
          this.video = {
            name: res.videoTitle,
            size: res.videoFileSize + "MB",
          };
        })
        .catch((msg) => {
          showMsgbox(msg);
        });
    },
    reget () {
      this.handleReset();
      // this.getList();
    },
    loadData () {
      this.isQuerying = true;
      const p1 = getVideoList({
        dataLakeId: sessionStorage.getItem("dataLakeId"),
        id: getUserInfo().id,
        category: this.search.video_type,
        videoTitle: this.search.video_name,
        checkUserId: this.search.operator,
        childId: this.search.visitor,
        checkUserName: this.search.checkUserid,
        checkStatus: this.search.checkStatus,
        listType: this.tabPosition,
        pager: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
        },
      });
      const p2 = getVideoSearchOptions({
        id: getUserInfo().id,
      });
      Promise.all([p1, p2])
        .then(([res1, res2]) => {
          if (Array.isArray(res2.categoryList)) {
            this.video_type_options = res2.categoryList.map((item) => {
              return {
                value: item.code,
                label: item.name,
              };
            });
          }
          if (Array.isArray(res2.teacherCategoryList)) {
            this.teacherCategoryList = res2.teacherCategoryList.map((item) => {
              return {
                value: item.code,
                label: item.name,
              };
            });
          }
          if (Array.isArray(res2.uploadTypeList)) {
            this.operator_options = res2.checkUserList.map((item) => {
              return {
                value: item.userId,
                label: item.userName,
              };
            });
          }
          if (Array.isArray(res2.childList)) {
            this.visitor_options = res2.childList.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            });
            // 加个全部
            this.choosableVisitor_options = this.visitor_options.map((itm) => ({
              ...itm,
              checked: false,
            }));
          }
          this.todoCount = res1.todoCount;
          this.tableData = res1.pageInfo.records.map((item) => {
            return {
              video_num: item.category,
              checkStatus: this.cheeck(item.checkStatus),
              checkUserName: item.checkUserName,
              checkVideoTime: this.puttime(item.checkVideoTime),
              childList: item.childList.map((i) => ({
                id: i.code,
              })),
              videoId: item.videoId,
              className: item.className,
              video_name: item.videoTitle,
              video_type: item.categoryName,
              upload_time: this.puttime(item.uploadTime),
              record_time: this.puttime(item.recordTime),
              uploader: item.uploadTypeName,
              videoUrl: item.videoUrl,
              visitor: item.childList.map((i) => i.name).join(),
            };
          });
          this.pagination.total = res1.pageInfo.total;
          this.isQuerying = false;
        })
        .catch((msg) => {
          showMsgbox(msg);
          this.isQuerying = false;
        });
    },

    getList () {
      this.isQuerying = true;
      getVideoList({
        dataLakeId: sessionStorage.getItem("dataLakeId"),
        id: getUserInfo().id,
        category: this.search.video_type,
        videoTitle: this.search.video_name,
        checkUserId: this.search.operator,
        childId: this.search.visitor,
        checkUserName: this.search.checkUserid,
        checkStatus: this.search.checkStatus,
        listType: this.tabPosition,
        pager: {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
        },
      })
        .then((res) => {
          this.todoCount = res.todoCount;
          this.tableData = res.pageInfo.records.map((item) => {
            return {
              video_num: item.category,
              checkStatus: this.cheeck(item.checkStatus),
              checkUserName: item.checkUserName,
              checkVideoTime: this.puttime(item.checkVideoTime),
              className: item.className,
              childList: item.childList.map((i) => ({
                id: i.code,
              })),
              videoId: item.videoId,
              video_name: item.tagName,
              video_type: item.categoryName,
              upload_time: this.puttime(item.uploadTime),
              record_time: this.puttime(item.recordTime),
              uploader: item.uploadTypeName,
              videoUrl: item.videoUrl,
              visitor: item.childList.map((i) => i.name).join(),
            };
          });
          this.pagination.total = res.pageInfo.total;
          this.isQuerying = false;
          this.searching = false;
        })
        .catch((msg) => {
          showMsgbox(msg);
          this.isQuerying = false;
          this.searching = false;
        });
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
      };
      this.getList();
    },
    handleVisitorOptionChange (val) {
      const checked = this.choosableVisitor_options.filter(
        (itm) => itm.checked
      );
      this.dialogForm.visible_role = checked.map((itm) => itm.value);
      const checkedLength = checked.length;
      const allLength = this.choosableVisitor_options.length;
      if (!val) {
        // 取消选中某项
        this.checkboxIndeterminate = checkedLength > 0;
        this.checkAll = false;
      } else {
        // 选中某项
        this.checkAll = checkedLength === allLength;
        this.checkboxIndeterminate =
          checkedLength > 0 && checkedLength < allLength;
      }
    },
    handleAllVisitorOptionChange (val) {
      this.choosableVisitor_options = this.choosableVisitor_options.map(
        (itm) => ({ ...itm, checked: val })
      );
      this.dialogForm.visible_role = val
        ? this.choosableVisitor_options.map((itm) => itm.value)
        : [];
      this.checkboxIndeterminate = false;
    },
    handleVisibleRoleClear () {
      this.dialogForm.visible_role = [];
      this.checkboxIndeterminate = false;
      this.checkAll = false;
      this.choosableVisitor_options = this.choosableVisitor_options.map(
        (itm) => ({ ...itm, checked: false })
      );
    },
    handleUpload () {
      this.isEdit = false;
      this.dialogVisible = true;
    },
    handleBeforeUpload (file) {
      const isVideoFile = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 <= 800;
      if (!isVideoFile) {
        this.$message.error("上传的视频文件格式只能是 Mp4 文件!");
      } else if (!isLt2M) {
        showMsgbox("上传的视频不能超过800M");
      } else {
        this.dialogForm = {
          ...this.dialogForm,
          videoCreationId: "",
          videoImg: "",
          videoUrl: "",
          videoDuration: "",
          videoFileSize: "",
          s3FileName: "",
          videoRelateUrl: "",
          videoRelateImg: "",
        };
        this.video = {
          name: file.name,
          size: formatFileSize(file.size),
        };
        this.upload_show_tips = true;
        this.uploadSuccess = false;
      }
      return isVideoFile && isLt2M;
    },
    handleUploadOnProgress (event) {
      this.uploading = true;
      this.uploadProgress = parseFloat(event.percent.toFixed(1));
    },
    handleUploadSuccess (res) {
      this.uploading = false;
      this.uploadSuccess = true;
      if (res.code === 401) {
        this.$store.commit("CLEAR_CACHE");
        this.$router.push("/login");
        return;
      }
      const data = res.data;
      this.dialogForm = {
        ...this.dialogForm,
        videoCreationId: data.videoCreationId,
        videoImg: data.videoImg + '?authorization=' + getUserInfo().token,
        videoUrl: data.videoUrl,
        videoDuration: data.videoDuration,
        videoFileSize: data.videoFileSize,
        s3FileName: data.s3FileName,
        videoRelateUrl: data.videoRelateUrl,
        videoRelateImg: data.videoRelateImg,
      };
    },
    handleUploadError () {
      this.upload_show_tips = false;
      this.uploading = false;
      this.video = {
        name: "",
        size: "",
      };
      this.dialogForm = {
        ...this.dialogForm,
        videoCreationId: "",
        videoImg: "",
        videoUrl: "",
        videoDuration: "",
        videoFileSize: "",
        videoRelateUrl: "",
        videoRelateImg: "",
      };
      showMsgbox("上传失败");
    },
    handleVideoClosed () {
      this.video_url = "";
    },
    shenhevideo () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.isCommitting = true;
          if (this.isEdit) {
            shenhe({
              checkResult: this.checkStatus,
              userId: getUserInfo().id,
              videoId: this.dialogForm.videoId,
              videoTitle: this.dialogForm.video_name,
              category: this.dialogForm.video_type,
              childList: this.dialogForm.visible_role.map((i) => ({
                id: i,
              })),
            })
              .then(() => {
                showMsgbox("审核视频成功", true);
                this.isCommitting = false;
                this.centerDialogVisible = false;
                this.getList();
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.isCommitting = false;
              });
          } else if (this.dialogForm.videoUrl) {
            shenhe({
              checkResult: this.checkStatus,
              userId: getUserInfo().id,
              videoId: this.dialogForm.videoId,
              videoTitle: this.dialogForm.video_name,
              category: this.dialogForm.video_type,
              childList: this.dialogForm.visible_role.map((i) => ({
                id: i,
              })),
            })
              .then(() => {
                showMsgbox("审核视频成功", true);
                this.isCommitting = false;
                this.centerDialogVisible = false;
                this.getList();
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.isCommitting = false;
              });
          } else {
            this.isCommitting = false;
            showMsgbox("视频还未上传成功");
          }
        }
      });
    },
    confirm () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.isCommitting = true;
          if (this.isEdit) {
            editVideoInfo({
              userId: getUserInfo().id,
              videoId: this.dialogForm.videoId,
              videoTitle: this.dialogForm.video_name,
              category: this.dialogForm.video_type,
              videoCreationId: this.dialogForm.videoCreationId,
              videoImg: this.dialogForm.videoImg,
              videoUrl: this.dialogForm.videoUrl,

              videoDuration: this.dialogForm.videoDuration,
              videoFileSize: this.dialogForm.videoFileSize,
              videoRelateUrl: this.dialogForm.videoRelateUrl,
              videoRelateImg: this.dialogForm.videoRelateImg,
              childList: this.dialogForm.visible_role.map((i) => ({
                id: i,
              })),
              recordTime: this.dialogForm.record_time,
            })
              .then(() => {
                showMsgbox("更新视频成功", true);
                this.isCommitting = false;
                this.dialogVisible = false;
                this.getList();
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.isCommitting = false;
              });
          } else if (this.dialogForm.videoUrl) {
            addVideoInfo({
              userId: getUserInfo().id,
              videoTitle: this.dialogForm.video_name,
              s3FileName: this.dialogForm.s3FileName,
              category: this.dialogForm.video_type,
              videoCreationId: this.dialogForm.videoCreationId,
              videoImg: this.dialogForm.videoImg,
              uploadType: 2,
              videoUrl: this.dialogForm.videoUrl,
              videoDuration: this.dialogForm.videoDuration,
              videoFileSize: this.dialogForm.videoFileSize,
              videoRelateUrl: this.dialogForm.videoRelateUrl,
              videoRelateImg: this.dialogForm.videoRelateImg,
              childList: this.dialogForm.visible_role.map((i) => ({
                id: i,
              })),
              recordTime: this.dialogForm.record_time,
            })
              .then(() => {
                showMsgbox("添加视频成功", true);
                this.isCommitting = false;
                this.dialogVisible = false;
                this.getList();
              })
              .catch((msg) => {
                showMsgbox(msg);
                this.isCommitting = false;
              });
          } else {
            this.isCommitting = false;
            showMsgbox("视频还未上传成功");
          }
        }
      });
    },
    handleDialogClosed () {
      this.$refs.dialogForm.clearValidate();
      this.upload_show_tips = false;
      this.uploadSuccess = false;
      this.uploading = false;
      this.isCommitting = false;
      this.isEdit = false;
      this.checkAll = false;
      this.checkboxIndeterminate = false;
      this.choosableVisitor_options = this.choosableVisitor_options.map(
        (itm) => ({ ...itm, checked: false })
      );
      this.dialogForm = {
        video_name: "",
        video_type: "",
        record_time: "",
        visible_role: [],
        videoRelateUrl: "",
        videoRelateImg: "",
      };
      this.video = {
        name: "",
        size: "",
      };
    },
    handleFocus () {
      this.$refs.videoName.clearValidate();
    },
    handleEdit (row) {
      this.isEdit = true;
      getVideoInfo({
        videoId: row.videoId,
        id: getUserInfo().id,
      })
        .then((res) => {
          this.dialogForm = {
            className: res.className,
            videoId: res.videoId,
            video_name: res.videoTitle,
            videoUrl: res.videoUrl,
            videoImg: res.videoImg + '?authorization=' + getUserInfo().token,
            video_type: res.category,
            record_time: res.recordTime,
            videoRelateUrl: "",
            videoRelateImg: "",
          };
          this.choosableVisitor_options = this.choosableVisitor_options.map(
            (item) => {
              return {
                ...item,
                checked: res.childList.some((itm) => itm.id === item.value),
              };
            }
          );
          const checked = this.choosableVisitor_options.filter(
            (itm) => itm.checked
          );
          this.dialogForm.visible_role = checked.map((itm) => itm.value);
          const checkedLength = checked.length;
          const allLength = this.choosableVisitor_options.length;
          this.checkboxIndeterminate =
            checkedLength > 0 && checkedLength < allLength;
          this.checkAll = allLength === checkedLength;
          this.video = {
            name: res.videoTitle,
            size: res.videoFileSize + "MB",
          };
          this.dialogVisible = true;
        })
        .catch((msg) => {
          showMsgbox(msg);
        });
    },
    handlePlay (row) {
      this.video_visible = true;
      this.video_url = row.videoUrl + "?authorization=" + getUserInfo().token;
      this.$nextTick(() => {
        this.$refs.video.play();
        playVideo({
          videoId: row.videoId,
        })
          .then(() => { })
          .catch((msg) => {
            showMsgbox(msg);
          });
      });
    },
    handleReset () {
      this.search = {
        video_type: "",
        video_name: "",
        operator: "",
        visitor: "",
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
.form {
  margin-top: 30px;
}
.el-badge {
  /deep/.el-badge__content {
    right: 85px !important;
  }
}
.shenhe {
  margin-top: 20px;
  .el-col-12 {
    width: 33% !important;
  }
}
.ghj {
  margin-top: 20px;
  width: 33%;
  display: inline-block;
}
</style>
