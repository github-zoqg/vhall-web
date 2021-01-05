<template>
  <div class="search-area">
    <el-form :inline="true" :model="searchParams" ref="searchForm" onsubmit="return false;">
      <el-form-item v-for="(item, index) in searchAreaLayout" :key="index">
        <el-button v-if="item.type==5" @click="deletedChecked" round>批量删除</el-button>
        <!-- 快速选择时间 -->
        <div class="time-kuai" v-else-if="item.type==1">
          <span
            v-for="(opt, optIndex) in item.options"
            :key="optIndex"
            :class="opt.active === isActive ? 'active' : ''"
            @click="changeTime(opt.active)"
            >{{ opt.title }}</span
          >
        </div>
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-else-if="item.type==2"
          v-model="searchParams[item.key]"
          value-format="yyyy-MM-dd"
          type="daterange"
          @change="changeDate"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 240px"
        />
        <!-- 日期选择器 -->
        <el-date-picker
          v-model="searchParams[item.key]"
          v-else-if="item.type==4"
          value-format="yyyy-MM-dd"
          @change="changeDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <!-- 下拉框 -->
        <el-select filterable clearable v-model="searchParams[item.key]" v-else-if="item.type==3"  style="width: 160px" @change="changeDate" :placeholder="item.placeholder">
          <el-option
            v-for="(opt, optIndex) in item.options"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-checkbox v-model="searchParams[item.key]" v-else-if="item.type==7"  @change="changeDate">{{ item.name }}</el-checkbox>
        <el-button v-else-if="item.type==6" @click="searchList" class="search" round>查询</el-button>
        <!-- 输入框 -->
        <el-input v-model.trim="searchParams[item.key]" suffix-icon="el-icon-search" :placeholder="placeholder" style="width: 180px" v-else  @keyup.enter.native="changeInput" @change="changeInput"  clearable></el-input>

      </el-form-item>
    </el-form>
    <div class="export-data" v-if="isExports">
      <el-button round type="white-primary" size="medium" @click="exportData">导出数据</el-button>
    </div>
  </div>
</template>
<script>
import { getRangeDays } from '@/utils/general';
export default {
  data() {
    return {
      isActive: 1,
      allTime: [
        {
          title: '全部',
          active: 1,
        },
        {
          title: '今日',
          active: 2,
        },
        {
          title: '近7日',
          active: 3,
        },
        {
          title: '近30日',
          active: 4,
        },
      ],
      searchParams: {
        searchIsTime: '1',
        type: 1
      },
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      }
    };
  },
  props: {
    searchAreaLayout: Array,
    active: {
      type: Number,
      default: 1
    },
    isDate: {
      type: Boolean,
      default: false
    },
    isExports: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请输入标题'
    },
    scene: {
      type: String,
      require: false,
      default: ''
    }
  },
  watch: {
    active() {
      this.isActive = this.active;
    }
  },
  created() {
    this.isActive = this.active;
    if (this.isDate) {
      this.initPage()
    }
  },
  methods: {
    initPage() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.searchParams.searchTime = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      // this.search();
    },
    dealDisabledData(time) {
      // 设置选择的日期小于当前的日期,小于返回true,日期不可选
      // return time.getTime() < Date.now() - 8.64e7
      //return time.getTime() < Date.now() - 8.64e7;//设置选择今天以及今天之后的日
      if (this.scene === 'center_data') {
        return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      } else {
        return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      }
      //return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
      // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      // 设置当天23：59：59可选
      // let currentTime = this.getNowMonthDay() + ` 23:59:59`
      // return time.getTime() > new Date(currentTime).getTime()
    },
    changeTime(index) {
      if (this.$route.path === '/finance/infoDetail') {
        return;
      }
      this.isActive = index || this.active;
       if (this.isActive == 3 || this.isActive == 4) {
        this.searchParams.end_time = getRangeDays(5);
      } else {
        this.searchParams.end_time = getRangeDays(2);
      }
      this.searchParams.start_time = this.isActive == 1 ? '' : getRangeDays(this.isActive);
      this.$emit("onSearchFun");
    },
    changeDate(){
      if (this.$route.path == '/finance/infoDetail') {
        return;
      }
      this.$emit("onSearchFun");
    },
    changeInput() {
      this.$emit("onSearchFun");
    },
    deletedChecked() {
      this.$emit("deletedChecked");
    },
    searchList() {
      this.$emit("onSearchFun");
    },
    exportData() {
      this.$emit("onExportData");
    }
  }
};
</script>
<style lang="less" scoped>
  .search-area{
    position: relative;
    // margin-top: 5px;
    /*选择框重置*/
      /deep/.el-input__inner{
        border-radius: 18px;
        height: 36px;
        background: transparent;
      }
      .el-range-separator{
        width: 10%;
        line-height: 28px;
      }
      /deep/.el-form-item__content {
        line-height: 34px;
      }
      /deep/.el-range-editor .el-range-input {
        background: transparent;
      }
      // .el-button{
      //   margin-right: 24px;
      //   border-radius: 18px;
      //   padding: 10px 20px;
      // }
      .el-form--inline .el-form-item {
          margin-right: 16px;
          margin-bottom: 20px;
      }
    .time-kuai {
      height: 36px;
      border: 1px solid #ccc;
      border-radius: 18px;
      background: transparent;
      line-height: 33px;
      span {
        border-radius: 18px;
        padding: 9px 16px;
        text-align: center;
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
      }
      .active {
        background: #fb3a32;
        color: #fff;
      }
    }
    .search{
      margin-left: 20px;
      background: #fb3a32;
      color: #fff;
      border: 0;
    }
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
