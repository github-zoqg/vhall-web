<template>
    <div style="display: inline-block">
        <span class="vhall-doc-controls">
            文档
                <el-switch
                    v-model="docStatus"
                >
                </el-switch>
                <el-button
                    @click="getDocList"
                    round
                    size="mini"
                    class="mini-chose-btn"
                >
                    选择文档
                </el-button>

                <el-dialog
                    title="提示"
                    :visible.sync="showSelectDoc"
                    :show-close="false"
                    custom-class="vhall-select-doc-dialog"
                >

                    <div slot="title" class="vhall-select-doc-dialog--title">
                        文件列表
                    </div>

                    <div class="vhall-select-doc-dialog--content">
                        <el-table
                            :data="tableData"
                            style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="日期"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="姓名"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="地址">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-dialog>

        </span>
        <!-- <el-dialog>

        </el-dialog> -->
    </div>
</template>

<script>
export default {
  data () {
    return {
      docStatus: false,
      showSelectDoc: true
    };
  },

  mounted () {
    this.getDocList();
  },

  methods: {
    getDocList () {
      this.showSelectDoc = !this.showSelectDoc;
      const token = JSON.parse(sessionStorage.getItem('user')).token;
      this.$vhallFetch('getDocList', {
        token: token
      }).then(res => {
        console.log('res', res);
      });
    }
  }
};
</script>
<style lang="less">
    .vhall-doc-controls{
        color: #b8bbca
    }
    .mini-chose-btn{
        height: 24px;
        line-height: 24px !important;
        vertical-align: middle;
        padding: 0 15px !important;
        margin-left: 20px;
    }
    .vhall-select-doc-dialog{
        width: 760px;
        max-height: 640px;
        margin: auto;
        background:#f3f4f6;
        .el-dialog__header{
            padding: 0;
        }
        &--title{
            height: 40px;
            line-height: 40px;
            background: #fff;
            color: #555;
            font-size: 14px;
        }

        &--content{
            padding: 0  55px;
        }
    }
</style>
