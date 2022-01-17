<template>
  <div class="common-container time-table-m" v-loading="isQuerying">
    <div class="table-title">
      <div class="table-title-left">
        <span class="label" style="margin-left: 0">课表时间段:</span>
        <el-select
          v-if="isEdit"
          v-model="form.year"
          size="small"
          
          placeholder=""
          class="year-select"
        >
          <el-option
            v-for="(op, idx) in year_options"
            :key="idx"
            :value="op.value"
            :label="op.label"
          />
        </el-select>
        <span v-else class="header-content">{{ form.year }}</span>
        <span class="label">年度</span>
        <el-select
          v-if="isEdit"
          v-model="form.term"
          size="small"
          placeholder=""
          class="term-select"
        >
          <el-option value="1" label="上" />
          <el-option value="2" label="下" />
        </el-select>
        <span v-else class="header-content">{{ form.term | termFilter }}</span>
        <span class="label">学期&nbsp;第</span>
        <el-select
          v-if="isEdit"
          v-model="form.from_week_num"
          size="small"
          placeholder=""
          class="week-select"
        >
          <el-option
            v-for="week in week_options"
            :key="week.key"
            :value="week.value"
            :label="week.label"
          />
        </el-select>
        <span v-else class="header-content">{{ form.from_week_num }}</span>
        <span class="label">周&nbsp;-&nbsp; </span>
        <el-select
          v-if="isEdit"
          v-model="form.year"
          size="small"
          placeholder=""
          class="year-select"
        >
          <el-option
            v-for="(op, idx) in year_options"
            :key="idx"
            :value="op.value"
            :label="op.label"
          />
        </el-select>
        <span v-else class="header-content">{{ form.year }}</span>
        <span class="label">年度</span>
        <el-select
          v-if="isEdit"
          v-model="form.term"
          size="small"
          placeholder=""
          class="term-select"
        >
          <el-option value="1" label="上" />
          <el-option value="2" label="下" />
        </el-select>
        <span v-else class="header-content">{{ form.term | termFilter }}</span>
        <span class="label">学期&nbsp;第</span>
        <el-select
          v-if="isEdit"
          v-model="form.to_week_num"
          size="small"
          placeholder=""
          class="week-select"
        >
          <el-option
            v-for="week in week_options"
            :key="week.key"
            :value="week.value"
            :label="week.label"
          />
        </el-select>
        <span v-else class="header-content">{{ form.to_week_num }}</span>
        <span class="label" style="margin-right: 57px">周</span>
        <div class="term-begin">
          <span class="label">开学日期:</span>
          <el-date-picker
            v-if="isEdit"
            class="date-picker"
            v-model="form.term_begin_date"
            value-format="yyyy-MM-dd"
          />
          <span v-else class="header-content">{{ form.term_begin_date }}</span>
        </div>
      </div>
      <div v-if="showEdit" class="table-title-btn-area">
        <div
          class="table-title-btns"
          v-loading="isCommitting"
          @click="handleEdit"
        >
          <i v-if="!isEdit" class="iconfont icon-bianji" />
          <i v-else class="iconfont icon-baocun"></i>
          {{ isEdit ? "保存课表" : "编辑课表" }}
        </div>
      </div>
    </div>
    <el-table :data="form.time_table" class="table-delete" border>
      <el-table-column label="时间段" min-width="240">
        <template slot-scope="{ row }">
          <div class="first-col">
            <el-select
              v-if="isEdit"
              v-model="row.start_hour"
              class="time-select"
              placeholder=""
              size="small"
            >
              <el-option
                v-for="hour in hour_options"
                :key="hour.key"
                :value="hour.value"
                :label="hour.label"
              />
            </el-select>
            <span v-else>{{ row.start_hour }}</span>
            <span style="margin: 0 1px">:</span>
            <el-select
              v-if="isEdit"
              v-model="row.start_minute"
              size="small"
              placeholder=""
              class="time-select"
            >
              <el-option
                v-for="minute in minute_options"
                :key="minute.key"
                :value="minute.value"
                :label="minute.label"
              />
            </el-select>
            <span v-else>{{ row.start_minute }}</span>
            <span style="margin: 0 1px">-</span>
            <el-select
              v-if="isEdit"
              v-model="row.end_hour"
              size="small"
              placeholder=""
              class="time-select"
            >
              <el-option
                v-for="hour in hour_options"
                :key="hour.key"
                :value="hour.value"
                :label="hour.label"
              />
            </el-select>
            <span v-else>{{ row.end_hour }}</span>
            <span style="margin: 0 1px">:</span>
            <el-select
              v-if="isEdit"
              v-model="row.end_minute"
              size="small"
              placeholder=""
              class="time-select"
            >
              <el-option
                v-for="minute in minute_options"
                :key="minute.key"
                :value="minute.value"
                :label="minute.label"
              />
            </el-select>
            <span v-else>{{ row.end_minute }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="周一">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_monday" />
          <span v-else>{{ row.course_monday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周二">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_tuesday" />
          <span v-else>{{ row.course_tuesday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周三">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_wednesday" />
          <span v-else>{{ row.course_wednesday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周四">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_thursday" />
          <span v-else>{{ row.course_thursday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周五">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_friday" />
          <span v-else>{{ row.course_friday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周六">
        <template slot-scope="{ row }">
          <el-input v-if="isEdit" v-model="row.course_saturday" />
          <span v-else>{{ row.course_saturday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周日">
        <template slot-scope="{ row, $index }">
          <el-input v-if="isEdit" v-model="row.course_sunday" />
          <span v-else>{{ row.course_sunday }}</span>
          <i
            v-if="isEdit"
            class="iconfont icon-shanchu1 delete"
            @click="handleDeleteRow($index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="isEdit" class="add-line" @click="handleAddLine">
      <i class="iconfont icon-tianjia" />
      添加行
    </div>
  </div>
</template>

<script>
import {
  generateHours,
  generateMinutes,
  generateWeek,
  formateDate,
  showMsgbox,
  getUserInfo,
} from "../../../utils";
import {
  getTimeLine,
  addTimeline,
  editTimeline,
 
} from "../../../api/timeline";
const now = new Date();
const now_year = now.getFullYear();
export default {
  data() {
    return {
      kebiao: "",
      isEdit: false,
      showEdit: getUserInfo().class_id,
      form: {
        id: "",
        year: now_year,
        term: "1",
        from_week_num: "1",
        to_week_num: "1",
        term_begin_date: formateDate(now),
        time_table: [0].map(() => {
          return {
            start_hour: "09",
            start_minute: "00",
            end_hour: "09",
            end_minute: "40",
            course_monday: "",
            course_tuesday: "",
            course_wednesday: "",
            course_thursday: "",
            course_friday: "",
            course_saturday: "",
            course_sunday: "",
          };
        }),
      },
      year_options: [
        {
          value: `${now_year - 3}`,
          label: now_year - 3,
        },
        {
          value: `${now_year - 2}`,
          label: now_year - 2,
        },
        {
          value: `${now_year - 1}`,
          label: now_year - 1,
        },
        {
          value: `${now_year}`,
          label: now_year,
        },
        {
          value: `${now_year + 1}`,
          label: now_year + 1,
        },
        {
          value: `${now_year + 2}`,
          label: now_year + 2,
        },
        {
          value: `${now_year + 3}`,
          label: now_year + 3,
        },
      ],
      hour_options: generateHours(),
      minute_options: generateMinutes(),
      week_options: generateWeek(),
      isQuerying: false,
      isCommitting: false,
    };
  },
  computed: {},
  mounted() {
    this.getTimeLine();
  },
  methods: {
    getTimeLine() {
      this.isQuerying = true;
      getTimeLine({
        userId: getUserInfo().id,
      })
        .then((res) => {
          if (res) {
            this.form = {
              id: res.id,
              year: res.academicYear,
              term: res.academicTerm,
              from_week_num: res.academicWeekBegin,
              to_week_num: res.academicWeekEnd,
              term_begin_date: res.beginDate,
              time_table: JSON.parse(res.course),
            };
          }
          this.isQuerying = false;
        })
        .catch((msg) => {
          this.isQuerying = false;
          showMsgbox(msg);
        });
    },
    handleEdit() {
      if (this.isEdit) {
        // 保存课表
        const kebiao = this.form.time_table;
        const l = this.form.time_table.length;

        if (l >= 1 && l <= 15) {
          this.isCommitting = true;
          if (l === 1) {
            this.kebiao = true;
          } else {
            for (var i = 0, length = l; i < l - 1; i++) {
              if (kebiao[i].end_hour <= kebiao[i + 1].start_hour) {
                
                if (kebiao[i].end_hour < kebiao[i + 1].start_hour) {
                  this.kebiao = true;
                }
                else if (
                  kebiao[i].end_hour === kebiao[i + 1].start_hour &&
                  kebiao[i].end_minute <= kebiao[i + 1].start_minute
                ) {
                  this.kebiao = true;
                } else {
                  this.kebiao = false;
                }
              } else {
                this.kebiao = false;
              }
            }
          }
          if (this.kebiao) {
            if (this.form.id) {
              editTimeline({
                id: this.form.id,
                classId: getUserInfo().class_id,
                academicYear: this.form.year,
                academicTerm: this.form.term,
                academicWeekBegin: this.form.from_week_num,
                academicWeekEnd: this.form.to_week_num,
                cademicTermBegin: this.form.term_begin_date,
                course: JSON.stringify(this.form.time_table),
              })
                .then(() => {
                  showMsgbox("保存课表成功", true);
                  this.isCommitting = false;
                  this.isEdit = false;
                  // 修改完课表，再查看下是否过期
                  // checkExpired({
                  //   id: getUserInfo().id,
                  // })
                  //   .then((res) => {
                  //     this.$store.commit("SET_EXPIRED", false);
                  //   })
                  //   .catch((msg) => {
                  //     showMsgbox(msg);
                  //     this.$store.commit("SET_EXPIRED", true);
                  //   });
                })
                .catch((msg) => {
                  showMsgbox(msg);
                  this.isCommitting = false;
                });
            } else {
              addTimeline({
                classId: getUserInfo().class_id,
                academicYear: this.form.year,
                academicTerm: this.form.term,
                academicWeekBegin: this.form.from_week_num,
                academicWeekEnd: this.form.to_week_num,
                cademicTermBegin: this.form.term_begin_date,
                course: JSON.stringify(this.form.time_table),
              })
                .then(() => {
                  showMsgbox("保存课表成功", true);
                  this.isCommitting = false;
                  this.isEdit = false;
                })
                .catch((msg) => {
                  showMsgbox(msg);
                  this.isCommitting = false;
                });
            }
          } else {
            this.$alert("课程时间冲突请重新编辑", "提示", {
              type: "warning",
            });
            this.isCommitting = false;
          }
        } else {
          this.$alert("课程节数至少为1节，至多为15节", "提示", {
            type: "warning",
          });
        }
      } else {
        this.isEdit = true;
      }
    },
    handleAddLine() {
      if (this.form.time_table.length < 15) {
        this.form.time_table.push({
          start_hour: "09",
          start_minute: "00",
          end_hour: "09",
          end_minute: "40",
          course_monday: "",
          course_tuesday: "",
          course_wednesday: "",
          course_thursday: "",
          course_friday: "",
          course_saturday: "",
          course_sunday: "",
        });
      } else {
        this.$alert("课程条数不能多于15节", "提示", {
          type: "warning",
        });
      }
    },
    handleDeleteRow(index) {
      if (this.form.time_table.length > 1) {
        this.form.time_table.splice(index, 1);
      } else {
        this.$alert("课程条数不能少于1节", "提示", {
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/main";
@import "../../../style/element-variables";
.first-col {
  display: flex;
  align-items: center;
}
.year-select {
  flex: 0 0 80px;
}
.term-select {
  flex: 0 0 80px;
}
.week-select {
  flex: 0 0 64px;
}
.term-begin {
  display: flex;
  align-items: center;
  .date-picker {
    width: 142px !important;
  }
}
.time-select {
  flex: 0 0 64px;
}
.el-input {
  height: auto;
}
.label {
  margin: 0 2px;
}
.header-content {
  color: $--color-primary;
}
.delete {
  position: absolute;
  right: -19px;
  font-size: 14px;
  color: $red;
  cursor: pointer;
}
.add-line {
  width: 100%;
  height: 42px;
  border: 1px solid $borderColor;
  border-top: none;
  line-height: 42px;
  box-sizing: border-box;
  color: $blue;
  padding: 0 11px;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
</style>
