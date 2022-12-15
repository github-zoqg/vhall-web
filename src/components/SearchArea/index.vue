<template>
  <div class="search-area">
    <el-form :inline="true" :model="searchParams" ref="searchForm" onsubmit="return false;">
      <el-form-item v-for="(item, index) in searchAreaLayout" :key="index">
        <el-button v-if="item.type == 5" @click="deletedChecked" round>批量删除</el-button>
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-else-if="item.type == 2"
          v-model="searchParams[item.key]"
          value-format="yyyy-MM-dd"
          type="daterange"
          prefix-icon="iconfont-v3 saasicon_date"
          @change="changeDate"
          :unlink-panels="true"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 240px"
        />
        <!-- 日期选择器 -->
        <el-date-picker
          v-model="searchParams[item.key]"
          v-else-if="item.type == 4"
          value-format="yyyy-MM-dd"
          @change="changeDate"
          type="date"
          prefix-icon="iconfont-v3 saasicon_date"
          placeholder="选择日期"
        ></el-date-picker>
        <!-- 下拉框 -->
        <el-select
          filterable
          v-model="searchParams[item.key]"
          v-else-if="item.type == 3"
          style="width: 160px"
          @change="changeDate"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="(opt, optIndex) in item.options"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-checkbox
          v-model="searchParams[item.key]"
          v-else-if="item.type == 7"
          @change="changeDate"
        >
          {{ item.name }}
        </el-checkbox>
        <el-button v-else-if="item.type == 6" @click="searchList" size="medium" round>
          查询
        </el-button>
        <!-- 输入框 -->
        <VhallInput
          v-else
          class="search-tag"
          :placeholder="placeholder"
          v-model="searchParams[item.key]"
          clearable
          v-clearEmoij
          @change="changeInput"
          @keyup.enter.native="changeInput"
        >
          <i class="el-icon-search el-input__icon" slot="prefix" @click="changeInput"></i>
        </VhallInput>
      </el-form-item>
    </el-form>
    <div class="export-data" v-if="isExports">
      <el-button :disabled="isForbidExport" round size="medium" @click="exportData">
        导出数据
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchParams: {
          searchIsTime: '1',
          type: 1
        },
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: time => {
            return this.dealDisabledData(time);
          }
        }
      };
    },
    props: {
      searchAreaLayout: Array,
      isDate: {
        type: Boolean,
        default: false
      },
      isExports: {
        type: Boolean,
        default: true
      },
      isForbidExport: {
        type: Boolean,
        default: false
      },
      clearable: {
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
    created() {
      if (this.isDate) {
        this.initPage();
      }
    },
    methods: {
      initPage() {
        // 初始化设置日期为最近一周
        const end = new Date();
        const start = new Date();
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.searchParams.searchTime = [
          dayjs(start).format('YYYY-MM-DD'),
          dayjs(end).format('YYYY-MM-DD')
        ];
      },
      dealDisabledData(time) {
        // 设置选择的日期小于当前的日期,小于返回true,日期不可选
        if (this.scene === 'center_data') {
          return time.getTime() > Date.now() - 8.64e7; //设置选择今天之前的日期（不能选择当天）
        } else {
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        }
      },
      changeDate() {
        if (this.$route.path == '/finance/infoDetail') {
          return;
        }
        this.$emit('onSearchFun');
      },
      changeInput() {
        this.$emit('onSearchFun');
      },
      deletedChecked() {
        this.$emit('deletedChecked');
      },
      searchList() {
        this.$emit('onSearchFun');
      },
      exportData() {
        this.$emit('onExportData');
      }
    }
  };
</script>
<style lang="less" scoped>
  .search-area {
    position: relative;
    // margin-top: 5px;
    /*选择框重置*/
    /deep/.el-input__inner {
      border-radius: 18px;
      height: 36px;
      background: transparent;
    }
    .el-range-separator {
      width: 10%;
      line-height: 28px;
    }
    /deep/.el-form-item__content {
      line-height: 34px;
    }
    /deep/.el-range-editor .el-range-input {
      background: transparent;
    }
    /deep/.el-date-editor {
      .el-range__icon,
      .el-range__close-icon {
        line-height: 29px;
      }
    }
    // .el-button{
    //   margin-right: 24px;
    //   border-radius: 18px;
    //   padding: 10px 20px;
    // }
    .el-form--inline .el-form-item {
      margin-right: 16px;
      margin-bottom: 24px;
    }
    .search {
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
    /deep/.el-select {
      .el-select__caret.el-input__icon.el-icon-arrow-up {
        line-height: 37px;
      }
    }
    .search-tag {
      width: 220px !important;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px !important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
</style>
