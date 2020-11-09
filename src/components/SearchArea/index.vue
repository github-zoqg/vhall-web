<template>
  <div class="search-area">
    <el-form :inline="true" :model="searchParams" ref="searchForm">
      <el-form-item v-for="(item, index) in searchAreaLayout" :key="index">
        <el-button v-if="item.type==5" @click="deletedChecked">批量删除</el-button>
        <!-- 快速选择时间 -->
        <div class="time-kuai" v-else-if="item.type==1">
          <span
            v-for="(opt, optIndex) in allTime"
            :key="optIndex"
            :class="opt.active === isActive ? 'active' : ''"
            @click="changeTime(opt)"
            >{{ opt.title }}</span
          >
        </div>
        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="item.type==2"
          v-model="searchParams[item.key]"
          value-format="yyyy-MM-dd"
          type="date"
          @change="changeDate"
          style="width: 150px"
          placeholder="选择日期"
        />
        <!-- 下拉框 -->
        <el-select filterable clearable v-model="searchParams[item.key]" v-else-if="item.type==3"  style="width: 160px" @change="changeDate">
          <el-option
            v-for="(opt, optIndex) in item.options"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 输入框 -->
        <el-input v-model="searchParams[item.key]" suffix-icon="el-icon-search" :placeholder="placeholder" style="width: 180px" v-else @change="changeDate"></el-input>
      </el-form-item>
    </el-form>
    <div class="export-data" v-if="isExports">
        <span @click="exportData">导出数据</span>
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
          title: '昨日',
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
        searchVersion: 1,
        searchIsTime: '1'
      }
    };
  },
  props: {
    searchAreaLayout: Array,
    isExports: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请输入标题'
    }
  },
  created() {
    this.searchParams.endTime = getRangeDays(this.isActive);
  },
  methods: {
    changeTime(opt) {
      this.isActive = opt.active;
      this.searchParams.startTime = getRangeDays(opt.active);
      this.$emit("onSearchFun");
    },
    changeDate(){
      this.$emit("onSearchFun");
    },
    deletedChecked() {
      this.$emit("deletedChecked");
    },
    exportData() {
      this.$emit("onExportData");
    },
    reset() {
      console.log("111111111111");
    }
  }
};
</script>
<style lang="less" scoped>
  .search-area{
    position: relative;
    /*选择框重置*/
      /deep/ .el-input__inner{
        border-radius: 18px;
        height: 35px;
      }
      /deep/.el-input__icon{
      line-height: 40px;
      }
      .el-button{
        margin-right: 24px;
        border-radius: 18px;
        padding: 10px 20px;
      }
      .el-form--inline .el-form-item {
          margin-right: 16px;
      }
    .time-kuai {
      height: 36px;
      border: 1px solid #dcdfe6;
      border-radius: 18px;
      background: #fff;
      line-height: 36px;
      margin-top: 2px;
      span {
        border-radius: 18px;
        padding: 8px 16px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
      }
      .active {
        background: #fb3a32;
        color: #fff;
      }
    }
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
      width: 104px;
      height: 35px;
      border-radius: 20px;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 35px;
      background: #fff;
      cursor: pointer;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
      }
    }
    .export-data:hover {
      background: #fb3a32;
      border: none;
      span {
        color: #fff;
      }
    }
  }
</style>
