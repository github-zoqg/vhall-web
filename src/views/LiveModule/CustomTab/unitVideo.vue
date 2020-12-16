<template>
  <div>
    <div class="search">
      <div class="search-query">
        <el-input
          placeholder="请输入直播名称"
          v-model="query.keyword">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="searchHandle">
          </i>
        </el-input>
      </div>
    </div>
    <!-- 专题列表 or  专题列表 -->
    <div class="live-panel">
      <el-row :gutter="40" class="lives">
        <!--:xs="24" :sm="12" :md="12" :lg="8" :xl="6"
        col-lg-*  一般用于大屏设备（min-width：1200px）
        col-md-*  一般用于中屏设备（min-width：992px）
        col-sm-*  一般用于小屏设备（min-width：768px）
        col-xs  -*用于超小型设备（max-width：768px）
        -->
        <el-col class="liveItem":xs="24" :sm="12" :md="12" :lg="8" :xl="8" v-for="(item, index) in dataList" :key="index">
          <div class="inner">
            <div class="top">
              <span class="liveTag">
                <label class="live-status" v-if="item.webinar_state == 1">
                <img src="../../../common/images/live.gif" alt=""/></label>{{item | liveTag}}
              </span>
              <span class="hot"><i class="el-icon-view"></i>{{ item.pv | unitCovert}}</span>
              <img :src="item.img_url" alt="" />
            </div>
            <div class="bottom">
              <div class="">
                <p class="liveTitle">{{item.subject}}</p>
                <p class="liveTime">{{item.start_time}}</p>
              </div>
            </div>
            <transition name="el-zoom-in-bottom">
              <div class="mask" v-show="!!item.liveDropDownVisible"></div>
            </transition>
          </div>
        </el-col>
      </el-row>
    </div>
    <SPagination
      :total="total"
      :page-size='query.limit'
      :current-page='query.pageNumber'
      @current-change="changeHandle" align="center"
      v-if="total > 0"
    ></SPagination>
  </div>
</template>

<script>
export default {
  name: "unitVideo.vue",
  components: {
  },
  data() {
    return {
      showCompIndex: 0,
      unitVideoForm: {
        component_id: '',
        msg: '',
        text: '',
        src: ''
      },
      unitVideoFormRules: {
        text: [
          { required: true, message: '文字不能为空', trigger: 'blur' },
          { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
          { min: 1, message: '请输入文字', trigger: 'blur' }
        ],
        src: [
          { required: true, message: '跳转地址不能为空', trigger: 'blur' },
          { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的跳转地址' , trigger: 'blur'}
        ]
      },
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1,
        keyword: ''
      },
      total: 0,
      tabType: null,
      dataList: []
    };
  },
  methods: {
    // 切换选项卡
    handleClick(tab, event) {
      console.log(tab, event);
      this.query.keyword = '';
      this.searchHandle();
    },
    // 查询
    searchHandle() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.getLiveList();
    },
    // 分页点击
    changeHandle(pageNum) {
      this.query.pageNumber = pageNum;
      this.query.pos = (pageNum-1)*this.query.limit;
      this.getLiveList();
    },
    // 获取直播列表
    getLiveList(){
      const params = {
        pos: this.query.pos,
        user_id: this.$route.params.str,
        limit: this.query.limit,
        title: this.query.keyword,
        order_type: 1, // 排序规则 1 按照创建时间排序 2 按照最后直播时间排序
        webinar_states: this.liveStatus, // 直播状态 默认为0 可以传入多个值 使用逗号分隔  0 全部 2 预告 1 直播 3 结束 5 回放 4 点播
        need_flash: 0 // 是否需要flash数据 0 否 1 是
      };
      this.loading = true;
      this.$fetch('liveList', this.$params(params)).then(res=>{
        if (res && res.code === 200) {
          let list = res.data.list;
          /*list.map(item => {
            item.img_url =
              // this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.img_url) || this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, item.img_url) || `${Env.staticLinkVo.tmplDownloadUrl}/img/v35-webinar.png`;
          });*/
          this.dataList = res.data.list;
          this.total = res.data.total;
        } else {
          this.dataList = [];
          this.total = 0;
        }
      }).catch(error=>{
        console.log(error);
        this.dataList = [];
        this.total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    /*
    * 参数1： compVoStr 参数结果对象，包含保存前数据
    * 参数2： index 当前展示部分组件下标 */
    initDataComp(compVoStr, index) {
      console.log('文字链编辑区，每次show区域选中，右侧编辑区域变化', index);
      // if(this.unitVideoForm) {
      //   this.$refs.unitVideoForm.resetFields();
      // }
      let compVo = JSON.parse(compVoStr);
      if (compVo.compInfo && compVo.compInfo.text !== '' && compVo.compInfo.text !== null && compVo.compInfo.text !== undefined) {
        this.unitVideoForm.text = compVo.compInfo.text;
        this.unitVideoForm.src = compVo.compInfo.src;
      } else {
        this.unitVideoForm.text = '';
        this.unitVideoForm.src = '';
      }
      // 默认组件类别 和 组件名称
      this.unitVideoForm.component_id = compVo.component_id;
      this.unitVideoForm.msg = compVo.name;
      this.showCompIndex = index;
      this.getLiveList();
    },
    sendData() {
      this.$refs.unitVideoForm.validate((valid) => {
        if (valid) {
          this.$emit('cxtChangeInfo', {
            content: JSON.stringify(this.unitVideoForm),
            type: 'text-link',
            compIndex: this.showCompIndex
          });
        }
      });
    }
  },
  watch: {
    'unitVideoForm.text': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    },
    'unitVideoForm.src': {
      handler() {
        //执行代码
        this.sendData();
      },
      deep: true //为true，表示深度监听，这时候就能监测到a值变化
    }
  }
};
</script>

<style lang="less" scoped>
/* 直播、专题*/
.live-panel {
  padding: 0 24px;
}
.lives{
  margin: 24px 0 0 0;
  .liveItem{
    height: 252px;
    margin-bottom: 20px;
    .inner{
      transition: all .15s ease-in;
      position: relative;
    }
    .inner:hover{
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15);
    }
    .top{
      height: 175px;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      padding: 10px 10px;
      box-sizing: border-box;
      position: relative;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
      }
      .liveTag{
        background: rgba(0,0,0, .7);
        color: #fff;
        font-size: 12px;
        padding: 2px 9px;
        border-radius: 20px;
        position: relative;
        z-index: 2;
      }
      .live-status{
        padding: 5px;
        img{
          margin:6px 7px;
          width: 8px;
          height: 8px;
        }
      }
      .hot{
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: #fff;
        font-size: 14px;
        z-index: 2;
      }
    }
    .bottom{
      background: #fff;
      box-sizing: border-box;
      padding: 14px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #e6e6f6;
      .liveTitle{
        color: #1A1A1A;
        font-size: 16px;
        margin-bottom: 6px;
      }
      .liveTime{
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
