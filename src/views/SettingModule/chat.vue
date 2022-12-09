<template>
  <div>
    <div v-if="!auth_show">
      <null-page
        text="聊天严禁词为高级功能，设置后可以防止观众在聊天内容中输入不符合自身利益的词语，<br/>保障直播间健康有序地交流。联系您的客户经理获取权限后方可使用。"
        nullType="setting"
      >
        <el-button type="primary" round @click="openChat">联系客服</el-button>
      </null-page>
    </div>
    <div v-else>
      <pageTitle pageTitle="聊天严禁词" iconCssType="gary">
        <!-- <div slot="content">
          1.聊天、评论，包含严禁词自动过滤,适用于所有直播。垃圾信息系统已过滤无需添加
          <br/>
          2.批量上传时每个严禁词的长度为1~20个字符，超出范围的会自动丢弃
        </div> -->
      </pageTitle>
      <div>
        <el-button
          type="primary"
          @click.prevent.stop="setKeyWordShow"
          class="length104"
          size="medium"
          round
        >
          设置
        </el-button>
        <a :href="downloadHref" class="btn-a" @click="downLoad">
          <el-button class="length104" size="medium" round v-if="downloadHref">下载模板</el-button>
        </a>
      </div>
      <div class="setting-chat-main">
        <el-form :model="chatForm" ref="chatForm" label-width="86px">
          <el-form-item label="严禁词列表">
            <div class="words-white">
              {{ checkNames && checkNames.length > 0 ? checkNames.join('，') : '请设置聊天严禁词' }}
            </div>
            <div class="notice">
              <p>提示：</p>
              <p>
                1.设置聊天严禁词后，可以防止观众在聊天内容中输入不符合自身利益的词语，保障直播间健康有序地交流
              </p>
              <p>
                2.如果用户发送的聊天文字内容中包含设置的严禁词，则该聊天文字内容其他用户将不可见
              </p>
              <p>3.批量上传时每个严禁词的长度为1~20个字符，超出范围的会自动丢弃</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 聊天严禁词弹出框 -->
      <VhallDialog
        width="800px"
        title="聊天严禁词设置"
        :visible.sync="listPanelShow"
        @close="handleClose"
      >
        <div class="chat-dialog-content">
          <!-- 全部无结果 -->
          <div class="all-no-data" v-if="total === 0 && pageInfo.keyword === ''">
            <null-page nullType="nullData" text="暂未设置严禁词，快去添加吧" :height="0">
              <el-button
                type="primary"
                class="length106"
                @click.prevent.stop="addKeywordShow"
                size="medium"
                round
                :disabled="total === 1000"
              >
                添加
              </el-button>
              <el-button
                type="white-primary"
                class="length106"
                @click.prevent.stop="multiUploadKeywordShow"
                size="medium"
                round
                :disabled="total === 1000"
              >
                批量添加
              </el-button>
            </null-page>
          </div>
          <!-- 全部有结果 -->
          <div class="all-yes-data" v-else>
            <!-- 操作栏 -->
            <div class="operaBox">
              <el-button
                type="primary"
                @click.prevent.stop="addKeywordShow"
                size="medium"
                round
                :disabled="total === 1000"
              >
                添加
              </el-button>
              <el-button
                type="white-primary"
                @click.prevent.stop="multiUploadKeywordShow"
                size="medium"
                round
                :disabled="total === 1000"
              >
                批量添加
              </el-button>
              <el-button
                v-preventReClick
                @click.prevent.stop="multiKeywordDel"
                size="medium"
                round
                :disabled="!(ids && ids.length > 0)"
              >
                批量删除
              </el-button>
              <div class="searchBox">
                <el-input
                  class="search-tag"
                  placeholder="搜索严禁词"
                  v-model="pageInfo.keyword"
                  clearable
                  @clear="searchWord"
                  @keyup.enter.native="searchWord"
                >
                  <i class="el-icon-search el-input__icon" slot="prefix" @click="searchWord"></i>
                </el-input>
              </div>
            </div>
            <el-table
              ref="chatTable"
              :data="showChatList"
              tooltip-effect="dark"
              style="width: 100%"
              class="table-td56"
              height="328px"
              max-height="328px"
              :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '56px' }"
              @selection-change="checkMoreRow"
              @select-all="checkAllRow"
              v-loadMore="moreLoadData"
            >
              <div slot="empty" style="height: 0"></div>
              <el-table-column type="selection" width="55" align="left" />
              <el-table-column
                label="严禁词"
                prop="name"
                width="auto"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" width="114" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button type="text" v-preventReClick @click="keywordEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="text" v-preventReClick @click="keywordDel(scope.row, 2)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="select-option" v-if="total">
              已选择
              <span>{{ ids.length || 0 }}</span>
              个，共
              <span>{{ total }}</span>
              条
            </div>
            <!-- 无聊天严禁词内容 -->
            <null-page class="search-no-data" :height="0" v-if="total === 0"></null-page>
          </div>
        </div>
      </VhallDialog>
      <!-- 添加严禁词 -->
      <VhallDialog
        width="468px"
        :title="addForm.executeType === 'edit' ? '编辑严禁词' : '添加严禁词'"
        :visible.sync="addShow"
        append-to-body
      >
        <div :class="`chat-add-dialog-content ${addForm.executeType}`">
          <el-form :model="addForm" ref="addForm" :rules="dynamicRules" label-width="54px">
            <el-form-item label="严禁词" prop="name">
              <!--  <el-input
                v-if="addForm.executeType === 'add'"
                type="textarea"
                placeholder="可同时添加多个严禁词，中间以逗号(不区分中英文)分隔,每个严禁词的长度为1~20个字符，超出范围的会自动丢弃"
                v-model.trim="addForm.name"
                :maxlength="1000"
                autocomplete="off"
                show-word-limit
              ></el-input> -->
              <VhallInput
                :type="addForm.executeType === 'add' ? 'textarea' : 'text'"
                :placeholder="
                  addForm.executeType === 'add'
                    ? '可同时添加多个严禁词，中间以逗号(不区分中英文)分隔,每个严禁词的长度为1~20个字符，超出范围的会自动丢弃'
                    : '每个严禁词的长度为1~20个字符'
                "
                v-model="addForm.name"
                :maxlength="addForm.executeType === 'add' ? 1000 : 20"
                autocomplete="off"
                show-word-limit
              ></VhallInput>
            </el-form-item>
          </el-form>
          <div class="dialog-right-btn">
            <el-button
              type="primary"
              v-preventReClick
              @click.prevent.stop="keywordSend"
              size="medium"
              round
            >
              确 定
            </el-button>
            <el-button @click="addShow = false" size="medium" round>取 消</el-button>
          </div>
        </div>
      </VhallDialog>
      <!-- 批量上传 -->
      <VhallDialog
        class="addForbidWord"
        width="468px"
        title="添加严禁词"
        :visible.sync="multiUploadShow"
        append-to-body
        @close="closeImportChat"
      >
        <div class="upload-dialog-content">
          <file-upload
            ref="chatUpload"
            v-model="fileUrl"
            @delete="deleteFile"
            :saveData="{
              path: pathUrl,
              type: 'exel'
            }"
            :on-success="uploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
          >
            <div slot="upload-result">
              <!-- 状态1： 有上传过文件，后面重新删除等-变为未上传 -->
              <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && fileUrl">
                请使用模版上传文件
              </p>
              <!-- 状态2： 已选择文件，提示上传中，进度条 -->
              <div v-if="uploadResult && uploadResult.status === 'progress'">
                <div class="progressBox">
                  <el-progress :percentage="percent"></el-progress>
                </div>
              </div>
              <!-- 状态3： 检测失败 -->
              <div class="change-txt" v-if="uploadResult && uploadResult.status === 'error'">
                <p class="p-error">{{ uploadResult.text }}</p>
              </div>
              <!-- 状态4:  检测成功 -->
              <div class="change-txt" v-if="uploadResult && uploadResult.status === 'success'">
                <p class="p-right">
                  上传成功，共检测到{{ importResult && importResult.success }}条有效数据
                </p>
              </div>
            </div>
            <!-- 状态1： 未上传 -->
            <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && !fileUrl">
              请使用模版上传文件
            </p>
          </file-upload>
          <div class="dialog-right-btn">
            <el-button type="primary" v-preventReClick @click="saveUploadKey" size="medium" round>
              确 定
            </el-button>
            <el-button @click="closeImportChat" size="medium" round>取 消</el-button>
          </div>
        </div>
      </VhallDialog>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/FileUpload/main';
  import PageTitle from '@/components/PageTitle';
  import NullPage from '../PlatformModule/Error/nullPage.vue';
  import { sessionOrLocal } from '@/utils/utils';
  import env from '@/api/env';
  export default {
    name: 'chatMgr',
    components: {
      PageTitle,
      FileUpload,
      NullPage
    },
    data() {
      return {
        lowerGradeInterval: null,
        isUploadEnd: false,
        uploadResult: {
          status: 'start',
          text: '请选择模板文件'
        },
        percent: 0,
        chatForm: {},
        checkNames: [],
        keyWordDao: {
          total: 0,
          list: []
        },
        pageInfo: {
          keyword: '',
          pos: 0,
          limit: 6,
          pageNum: 1
        },
        downloadHref: null,
        // 列表展示开始
        listPanelShow: false,
        isHandle: false, // 是否有操作项
        showChatList: [],
        total: 0,
        totalPages: 0,
        tableColumn: [
          {
            label: '严禁词',
            key: 'name'
          }
        ],
        tableRowBtnFun: [
          {
            name: '编辑',
            methodName: 'keywordEdit'
          },
          {
            name: '删除',
            methodName: 'keywordDel'
          }
        ],
        ids: [],
        // 添加严禁词
        addShow: false,
        addForm: {
          id: null,
          name: null,
          type: 'add'
        },
        addFormRules: {
          name: [
            { required: true, message: '请输入严禁词', trigger: 'blur' },
            { maxlength: 1000, message: '最多可输入1000个字符', trigger: 'blur' }
          ]
        },
        editFormRules: {
          name: [
            { required: true, message: '请输入严禁词', trigger: 'blur' },
            { maxlength: 20, message: '单个严禁词可输入1~20个字符', trigger: 'blur' }
          ]
        },
        // 批量添加严禁词
        multiUploadShow: false,
        fileUrl: '', // 文件地址
        fileResult: '', // 文件上传结果
        importResult: {
          fail: 0,
          success: 0
        },
        isCheckAll: false,
        auth_show: false
      };
    },
    computed: {
      dynamicRules() {
        console.log(this.addForm);
        return this.addForm.executeType === 'add' ? this.addFormRules : this.editFormRules;
      },
      pathUrl: function () {
        // return `sys/${window.sessionStorage.getItem('userId')}_v3_${new Date().getTime()}`;
        return `interacts/keyword-docs`;
      }
    },
    // mounted() {
    //   this.handleLowerGradeHeart()
    // },
    methods: {
      getSysConfig() {
        let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        if (permissions) {
          let perVo = JSON.parse(permissions);
          console.log(perVo, '权限-用户');
          // perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
          if (perVo['front_keywords'] > 0) {
            // 开启
            this.auth_show = true;
            this.getKeywordTemplate();
            this.getAllKeyWordList();
          } else {
            this.auth_show = false;
          }
        }
      },
      handleLowerGradeHeart() {
        this.lowerGradeInterval = setInterval(() => {
          this.getLowerGradeConfig();
        }, (Math.random() * 5 + 5) * 1000);
      },
      getLowerGradeConfig() {
        this.$fetch('lowerGrade', {})
          .then(res => {})
          .catch(res => {
            // 降级没有code吗
            const { activity, user, global } = res;
            // 优先顺序：互动 > 用户 > 全局
            const activityConfig =
              activity && activity.length > 0
                ? activity.find(option => option.audience_id == this.$route.params.str)
                : null;
            const userConfig =
              user && user.length > 0
                ? user.find(option => option.audience_id == this.userId)
                : null;
            console.log('777777777', res);
            if (activityConfig) {
              this.setLowerGradeConfig(activityConfig.permissions);
            } else if (userConfig) {
              this.setLowerGradeConfig(userConfig.permissions);
            } else if (global && global.permissions) {
              this.setLowerGradeConfig(global.permissions);
            }
          });
      },
      setLowerGradeConfig(data) {
        if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
        const permission = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        const permissionInfo = Object.assign(permission, data);
        if (permissionInfo) {
          let perVo = JSON.parse(permissionInfo);
          console.log(perVo, '权限-用户');
          // perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
          if (perVo['front_keywords'] > 0) {
            // 开启
            this.auth_show = true;
            this.getKeywordTemplate();
            this.getAllKeyWordList();
          } else {
            this.auth_show = false;
          }
        }
      },
      openChat() {
        this.$vhall_paas_port({
          k: 100017,
          data: {
            business_uid: this.userId,
            user_id: '',
            s: '',
            webinar_id: '',
            refer: 3,
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        window.open(`${env.staticLinkVo.kf}`, '_blank');
      },
      downLoad() {
        this.$vhall_paas_port({
          k: 100588,
          data: {
            business_uid: this.userId,
            user_id: '',
            s: '',
            webinar_id: '',
            refer: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      deleteFile() {
        this.fileUrl = '';
        this.isUploadEnd = false;
        this.uploadResult = {
          status: 'start',
          text: '请上传文件'
        };
      },
      getAllKeyWordList() {
        this.$fetch('getKeywordList', {
          keyword: '',
          pos: 0,
          limit: 1000,
          pageNumber: 1
        })
          .then(res => {
            this.checkNames = res.data.list.map(item => {
              return item.name;
            });
          })
          .catch(e => {
            console.log(e);
            this.checkNames = [];
          });
      },
      handleClose() {
        // 情况所有选中效果
        this.ids = [];
        this.isCheckAll = false;
        try {
          this.$refs.chatTable.clearSelection();
        } catch (e) {}

        this.pageInfo.pageNum = 1;
        this.getAllKeyWordList();
      },
      // 获取关键字
      getKeywordList() {
        this.$fetch('getKeywordList', this.pageInfo)
          .then(res => {
            if (this.pageInfo.pos === 0) {
              this.showChatList = res.data.list;
            } else {
              this.showChatList.push(...res.data.list);
            }
            if (this.isCheckAll) {
              this.$refs.chatTable.toggleAllSelection();
            }
            console.log(`当前数据showChatList=${this.showChatList},total=${res.data.total}`);
            this.total = res.data.total;
            this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
          })
          .catch(e => {
            console.log(e);
          });
      },
      moreLoadData() {
        if (this.pageInfo.pageNum >= this.totalPages) {
          return false;
        }
        this.pageInfo.pageNum++;
        this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
        this.getKeywordList();
      },
      // 打开关键字设置面板
      setKeyWordShow() {
        this.listPanelShow = true;
        this.pageInfo.keyword = '';
        this.searchKeyWord();
      },
      searchWord() {
        if (this.pageInfo.keyword) {
          this.$vhall_paas_port({
            k: 100587,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.searchKeyWord();
      },
      searchKeyWord() {
        this.pageInfo.pos = 0;
        this.pageInfo.pageNum = 1;
        this.showChatList = [];
        try {
          this.$refs.chatTable.clearSelection();
        } catch (e) {
          console.log(e);
        }
        this.getKeywordList();
      },
      // 表格操作列回调函数， val表示每行
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      // 批量选择
      checkMoreRow(val) {
        console.log(val);
        this.ids = val.map(item => {
          return item.id;
        });
      },
      checkAllRow(selection) {
        console.log('全选与非全选', selection);
        // 只要数量大于0，即是够了全选
        this.isCheckAll = selection && selection.length > 0;
      },
      // 编辑
      keywordEdit(rows) {
        let that = this;
        that.addShow = true;
        that.$nextTick(() => {
          try {
            if (that.$refs.addForm) {
              that.$refs.addForm.resetFields();
            }
            that.addForm.executeType = 'edit';
            that.$set(that.addForm, 'id', rows.id);
            that.$set(that.addForm, 'name', rows.name);
          } catch (e) {
            console.log(e);
          }
        });
      },
      // 严禁词新增 or 严禁词修改
      keywordSend() {
        // addForm.executeType
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$fetch(
              this.addForm.executeType === 'add' ? 'multiKeywordAdd' : 'multiKeywordEdit',
              this.addForm.executeType === 'add'
                ? {
                    keywords: this.addForm.name
                  }
                : {
                    keyword_id: this.addForm.id,
                    keyword: this.addForm.name
                  }
            )
              .then(res => {
                if (this.addForm.executeType === 'add') {
                  res.data.success > 0
                    ? this.$message({
                        message: `成功添加了${res.data.success}个严禁词`,
                        showClose: true,
                        // duration: 0,
                        type: 'success',
                        customClass: 'zdy-info-box'
                      })
                    : this.$message({
                        message: '添加失败',
                        showClose: true,
                        // duration: 0,
                        type: 'error',
                        customClass: 'zdy-info-box'
                      });
                } else {
                  this.$message({
                    message: `修改成功`,
                    showClose: true,
                    // duration: 0,
                    type: 'errror',
                    customClass: 'zdy-info-box'
                  });
                }
                this.$vhall_paas_port({
                  k: this.addForm.executeType === 'add' ? 100582 : 100584,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: '',
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                this.addShow = false;
                this.searchKeyWord(); // 刷新列表数据
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message:
                    this.addForm.executeType === 'add'
                      ? res.msg || `添加失败`
                      : res.msg || `修改失败`,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      // 删除
      keywordDel(rows, index) {
        let that = this;
        that
          .$confirm('是否要删除选中的严禁词？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
          .then(() => {
            that
              .$fetch('multiKeywordDel', {
                keyword_ids: rows.id
              })
              .then(res => {
                that.$vhall_paas_port({
                  k: index === 1 ? 100586 : 100585,
                  data: {
                    business_uid: that.userId,
                    user_id: '',
                    webinar_id: '',
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                that.$message({
                  message: `删除成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                that.ids = [];
                that.isCheckAll = false;
                try {
                  that.$refs.chatTable.clearSelection();
                } catch (e) {
                  console.log(e);
                }
                that.searchKeyWord();
              })
              .catch(res => {
                console.log(res);
                that.$message({
                  message: res.msg || '删除失败',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          })
          .catch(() => {});
      },
      // 批量删除
      multiKeywordDel() {
        if (!(this.ids && this.ids.length > 0)) {
          this.$message({
            message: '请至少选择一条严禁词删除',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          /* this.keywordDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        }); */
          this.keywordDel(
            {
              id: this.ids.join(',')
            },
            1
          );
        }
      },
      // 打开新增弹出框
      addKeywordShow() {
        this.addShow = true;
        this.$nextTick(() => {
          try {
            if (this.$refs.addForm) {
              this.$refs.addForm.resetFields();
            }
          } catch (e) {
            console.log(e);
          }
        });
        this.addForm.executeType = 'add';
        this.addForm.id = null;
        this.addForm.name = null;
      },
      // 打开批量添加弹出框
      multiUploadKeywordShow() {
        this.multiUploadShow = true;
        this.fileUrl = '';
        // 清空面板
        this.importResult = {
          success: 0,
          fail: 0
        };
      },
      // 获取模板下载地址
      getKeywordTemplate() {
        this.$fetch('getKeywordTemplate', {})
          .then(res => {
            if (res && res.code === 200) {
              this.downloadHref = res.data.url || '';
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      // 下载模板
      downloadHrefHandle() {
        let winDom = window.open('_blank'); // 先打开页面
        winDom.location = `${this.downloadHref}`; // 后更改页面地址
      },
      // 文件上传成功
      uploadSuccess(res, file) {
        console.log(res, file);
        this.isUploadEnd = true;
        if (res.data.file_url) {
          this.fileUrl = res.data.file_url;
          // 文件上传成功，保存信息
          this.$fetch('checkUploadKeyword', {
            file: res.data.file_url
          })
            .then(resV => {
              this.importResult = resV.data;
              this.fileResult = 'success';
              this.uploadResult = {
                status: 'success',
                text: '检测成功'
              };
              if (this.$refs.chatUpload) {
                this.$refs.chatUpload.setError('');
              }
            })
            .catch(res => {
              this.fileResult = 'error';
              this.uploadResult = {
                status: 'error',
                text: res.msg
              };
              // this.$message.error(resV.msg || '导入严禁词信息校验失败！');
              this.isUploadEnd = false;
              this.importResult = null;
              if (this.$refs.chatUpload) {
                this.$refs.chatUpload.setError(res.msg || '导入严禁词信息校验失败');
              }
            });
        }
      },
      closeImportChat() {
        this.multiUploadShow = false;
        this.isUploadEnd = false;
        this.fileUrl = '';
        this.uploadResult = {
          status: 'start',
          text: '请上传文件'
        };
      },
      saveUploadKey() {
        if (!this.fileUrl) {
          this.$message({
            message: '请先选择文档',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.$fetch('uploadKeywordAdd', {
          file: this.fileUrl
        })
          .then(resV => {
            this.$vhall_paas_port({
              k: 100583,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.importResult = resV.data;
            this.multiUploadShow = false;
            this.isUploadEnd = false;
            this.fileUrl = '';
            /* resV.data.success > 0 ? this.$message({
          message: `成功添加了${resV.data.success}个严禁词`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        }) : this.$message({
          message: '添加失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        }); */
            // 重新刷新列表数据
            this.searchKeyWord();
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '导入聊天严禁词信息失败！',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['xls', 'xlsx'];
        let nameArr = file.name.split('.');
        const isType = typeList.includes(nameArr[nameArr.length - 1]); // typeList.includes(file.type.toLowerCase());
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message({
            message: `上传格式只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `上传文件大小不能超过 2MB!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
        this.isUploadEnd = false;
        this.uploadResult = {
          status: 'progress',
          text: '上传中，请稍候'
        };
        this.percent = parseInt(event.percent);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        // this.$message.error(`文件上传失败`);
        this.uploadResult = {
          status: 'error',
          text: '文件上传失败'
        };
        this.fileResult = 'error';
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      }
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getSysConfig();
    },
    beforeDestroy() {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
    }
  };
</script>

<style lang="less" scoped>
  .select-option {
    line-height: 20px;
    margin-top: 8px;
    /deep/span {
      color: #fb3a32;
      /* font-size: 16px;
    padding: 0 10px; */
    }
  }
  .btn-a {
    margin-left: 12px;
    /deep/button {
      background: transparent;
    }
  }
  .setting-chat-main {
    .layout--right--main();
    margin-top: 24px;
    padding: 48px 60px 48px 56px;
    min-height: 510px;
    /deep/.el-form-item__label {
      line-height: normal;
    }
  }
  .words-white {
    padding: 10px 12px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    height: 215px;
    overflow-y: auto;
    border-radius: 4px;
    border: 1px solid #cccccc;
    cursor: not-allowed;
  }
  .notice {
    margin-top: 8px;
    p {
      margin: 0 0;
      padding: 0 0;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      font-family: @fontRegular;
    }
  }
  .operaBox {
    overflow: hidden;
    margin-bottom: 20px;
    .el-link {
      margin-left: 20px;
    }
    .searchBox {
      float: right;
      .el-input {
        width: 220px;
        .el-input__icon {
          cursor: pointer;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
          /deep/ .el-input__icon {
            // width: auto;
            // margin-right: 5px;
            line-height: 36px;
          }
        }
      }
      /deep/ .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
        padding-right: 30px;
      }
    }
  }
  /deep/.el-textarea {
    textarea {
      min-height: 150px !important;
    }
  }
  .chat-dialog-content {
    /*dataList 里面已经包含30间距*/
    padding-bottom: 32px;
    .table-td56 {
      min-height: 0;
      /deep/.el-table {
        margin-bottom: 0;
      }
      /deep/.el-table__empty-block {
        height: 0 !important;
        min-height: 0;
      }
    }
  }
  .all-no-data {
    padding-top: 30px;
    margin-top: 32px;
    /deep/.createActive {
      padding-bottom: 30px;
    }
    /deep/.btn-list .el-button {
      margin-right: 0;
    }
  }
  .all-yes-data {
    padding: 0 0;
    /deep/.data-list {
      /deep/.el-table {
        margin-bottom: 40px;
        .cell {
          line-height: 25px;
        }
      }
    }
    /deep/.el-table .cell {
      line-height: 25px;
    }
  }
  .search-no-data {
    padding-top: 82px;
    margin-bottom: 50px;
    /deep/.search {
      padding-bottom: 0;
    }
  }
  .chat-add-dialog-content {
    &.add {
      /deep/.el-form-item__label {
        line-height: unset;
      }
    }
    /deep/.el-form-item__label:before {
      display: none;
    }
    overflow: hidden;
    /deep/.el-textarea__inner {
      padding: 8px 12px;
      line-height: 20px;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      // color: #999999;
      resize: none;
    }
    /deep/.el-input__count {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
  }
  .upload-dialog-content {
    overflow: hidden;
  }
  .dialog-right-btn {
    text-align: right;
    margin-bottom: 24px;
    margin-top: 24px;
  }
  /deep/.data-list {
    min-height: 418px;
  }

  /* 文件上传 */
  .p-right {
    font-weight: 400;
    margin-top: -5px;
    color: #888;
    font-size: 14px;
  }
  .p-error {
    font-weight: 400;
    margin-top: -5px;
    color: #fb3a32;
    font-size: 14px;
  }
  /deep/.el-progress__text /deep/i {
    font-size: 18px;
  }
  .progressBox {
    /deep/ .el-progress-bar__inner {
      background-color: #14ba6a;
    }
  }
</style>
<style lang="less">
  .addForbidWord {
    /deep/ .saasicon_shangchuan {
      color: #999 !important;
    }
  }
</style>
