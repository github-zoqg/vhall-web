<template>
  <div class="audienceBox">
    <pageTitle pageTitle="观众">
      <span class="dev-show-tips">
        观众分组应用于观看限制中的白名单，设置后只有指定的观众才能观看活动
      </span>
    </pageTitle>
    <div class="div__main" v-if="groupList.length > 0">
      <div class="table__container">
        <!-- 操作栏 -->
        <div class="operaBox">
          <el-button type="primary" round @click.prevent.stop="viewerDialogAdd" size="medium">新增观众</el-button>
          <el-button round @click.prevent.stop="importViewerOpen" size="medium">导入观众</el-button>
          <el-button round :disabled="multipleSelection.length == 0" @click.prevent.stop="viewerDel" size="medium">批量删除</el-button>
          <el-button round size="medium" v-if="downloadUrl" @click="downloadTemplate">下载模版</el-button>
          <div class="searchBox">
            <VhallInput
              placeholder="搜索内容"
              v-model="query.keyword"
              clearable
              autocomplete="off"
              v-clearEmoij
              @keyup.enter.native="queryList"
              class="resetRightBrn"
              @clear="queryList">
              <i
                class="el-icon-search el-input__icon"
                slot="prefix"
                @click="queryList">
              </i>
            </VhallInput>
          </div>
        </div>
        <!-- 列表 -->
        <div class="viewer_list" v-if="viewerDao.total || query.keyword">
          <el-table
              :data="viewerDao.list"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
            >
              <el-table-column
                type="selection"
                width="52"
                align="left"
              />
              <el-table-column
                prop="name"
                label="姓名"
                min-width="200"
                >
              </el-table-column>
              <el-table-column
                label="行业"
                min-width="200"
                >
                <template slot-scope="scope">
                  <span>{{ scope.row.industry || '- -' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="邮箱"
                width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.email || '- -' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="手机号"
                width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.phone || '- -' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="工号"
                width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.job_number || '- -' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="其他"
                width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.other || '- -' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                v-if="viewerDao.total"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="viewerDialogShow(scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    @click="delViewer(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
              <div slot="empty"><NullPage :nullType="'search'" v-if="!viewerDao.total" :text="'暂无数据'" :height="20"></NullPage></div>
          </el-table>
          <SPagination
              :total="viewerDao.total"
              v-if="viewerDao.total > 10"
              :currentPage="pageInfo.pageNum"
              @current-change="currentChangeHandler"
              align="center"
            >
          </SPagination>
        </div>
        <!-- <table-list
          ref="viewerTable"
          :manageTableData="viewerDao.list"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :isCheckout="isCheckout"
          :isHandle="isHandle"
          :totalNum="viewerDao.total"
          maxHeight="100%"
          width=120
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="viewerList"
          @changeTableCheckbox="handleSelectionChange"
        >
        </table-list> -->
        <!-- 无消息内容 -->
        <null-page nullType="other" v-else></null-page>
      </div>
      <div  class="group__container">
        <p class="group__title">全部分组</p>
        <div class="group_button__add" @click.prevent.stop="addGroupDialogShow(null)">
          <el-button size="medium" v-preventReClick type="primary" round>点击添加分组</el-button>
        </div>
        <ul v-if="groupList && groupList.length > 0">
            <el-dropdown
              placement="bottom-start"
              split-button
              size="medium"
              round
              @command="handleCommand($event, item)"
              trigger="click"
              v-for="(item, ins) in groupList"
              :key="`group${ins}`"
              @click.prevent.stop="changeViewerList(item, ins)"
              :class="{'active': activeGroupIndex == ins}"
            >{{ item.subject }}
              <el-dropdown-menu slot="dropdown" style="width: 152px;">
                <el-dropdown-item command="rename">重命名</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </ul>
        <div class="clear"></div>
      </div>
    </div>
    <div v-else>
      <null-page :nullType="'nullData'" :text="'您还没有观众分组，快来创建吧！'">
        <el-button type="primary"  round @click="addGroupDialogShow(null)" v-preventReClick>添加分组</el-button>
      </null-page>
    </div>
    <!-- 添加分组/ 重命名分组 -->
    <VhallDialog :title="groupDialog.title" v-if="groupDialog.visible" :visible.sync="groupDialog.visible" width="420px">
      <el-form :model="groupForm" ref="groupForm" :rules="groupFormRules" @submit.native.prevent>
        <el-form-item prop="subject">
          <VhallInput v-model.trim="groupForm.subject" auto-complete="off" placeholder="请输入分组名称" :maxlength="15"
                    :minlength="1" show-word-limit></VhallInput>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postGroupSend('groupForm')" round size="medium">确定</el-button>
        <el-button @click="groupDialog.visible = false" round size="medium">取消</el-button>
      </div>
    </VhallDialog>
    <!-- 添加观众/ 观众修改 -->
    <VhallDialog :title="viewerDialog.title" :visible.sync="viewerDialog.visible" width="484px">
      <el-form :model="viewerForm" ref="viewerForm" :rules="viewerFormRules" :label-width="viewerDialog.formLabelWidth">
        <el-form-item label="姓名" prop="name">
          <VhallInput v-model="viewerForm.name" v-clearEmoij auto-complete="off" placeholder="请输入姓名（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <VhallInput v-model="viewerForm.industry" v-clearEmoij auto-complete="off" placeholder="请输入行业（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <VhallInput v-model="viewerForm.email" v-clearEmoij auto-complete="off" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <VhallInput v-model.trim="viewerForm.phone" auto-complete="off" placeholder="请输入手机号码" :maxlength="11"/>
        </el-form-item>
        <el-form-item label="工号" prop="job_number">
          <VhallInput v-model.trim="viewerForm.job_number" auto-complete="off" placeholder="请输入工号（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="其他" prop="other">
          <VhallInput v-model="viewerForm.other" v-clearEmoij auto-complete="off" placeholder="请输入其他内容（最多50个字符）" :maxlength="50"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick @click="viewerSend('viewerForm')" size="medium" round :disabled="!viewerForm.name || (!viewerForm.email && !viewerForm.phone && !viewerForm.job_number && !viewerForm.other)">确定</el-button>
        <el-button @click="viewerDialog.visible = false" size="medium" round>取消</el-button>
      </div>
    </VhallDialog>
    <!-- 导入观众excel -->
    <VhallDialog title="导入观众"  :visible.sync="importFileShow" width="400px" @close="closeImportViewer">
      <div class="upload-dialog-content">
        <file-upload
          ref="viewerUpload"
          v-model="fileUrl"
          @delete="deleteFile"
          :saveData="{
             path: pathUrl,
             type: 'exel',
          }"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <div slot="upload-result">
            <!-- 状态1： 有上传过文件，后面重新删除等-变为未上传 -->
            <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && fileUrl">请使用模版上传文件</p>
            <!-- 状态2： 已选择文件，提示上传中，进度条 -->
            <div v-if="uploadResult && uploadResult.status === 'progress'">
              <div class="progressBox">
                <el-progress :percentage="percent" ></el-progress>
              </div>
            </div>
            <!-- 状态3： 检测失败 -->
            <div class="change-txt" v-if="uploadResult && uploadResult.status === 'error'">
              <p class="p-error">{{uploadResult.text}}</p>
            </div>
            <!-- 状态4:  检测成功 -->
            <div class="change-txt" v-if="uploadResult && uploadResult.status === 'success'">
              <p class="p-right">上传成功，共检测到{{importResult && importResult.success}}条有效数据，{{importResult && importResult.fail}}条无效数据</p>
            </div>
          </div>
          <!-- 状态1： 未上传 -->
          <p slot="tip" v-if="uploadResult && uploadResult.status === 'start' && !fileUrl">请使用模版上传文件</p>
        </file-upload>
        <p  class="down-error" v-show="importResult && importResult.fail > 0">
          <a href="javascript:void(0)" @click="downErrorHandle">下载查看无效数据</a>
        </p>
        <p class="uploadtips">提示：单个文件不超过5000条数据，数据量较大时请拆分上传</p>
        <div class="dialog-right-btn dialog-footer">
          <el-button type="primary" v-preventReClick @click="reloadViewerList" size="medium" round :disabled="fileResult === 'error'">确定</el-button>
          <el-button @click="closeImportViewer" size="medium" round>取消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import env from '@/api/env';
import {sessionOrLocal} from "@/utils/utils";
import NullPage from '../PlatformModule/Error/nullPage.vue';
import FileUpload from '@/components/FileUpload/main';
import Env from "@/api/env";

export default {
  name: "viewer",
  components: {
    NullPage,
    PageTitle,
    FileUpload
  },
  data() {
    return {
      activeGroupIndex: '',
      isUploadEnd: false,
      uploadResult: {
        status: 'start',
        text: '请选择模板文件'
      },
      percent: 0,
      isCheckout: true,
      isHandle: true,
      tableColumn: [
        {
          label: '姓名',
          key: 'name',
          width: ''
        },
        {
          label: '行业',
          key: 'industry',
          width: ''
        },
        {
          label: '邮箱',
          key: 'email',
          width: ''
        },
        {
          label: '手机号',
          key: 'phone',
          width: ''
        },
        {
          label: '工号',
          key: 'job_number',
          width: ''
        },
        {
          label: '其它',
          key: 'other',
          width: ''
        }
      ],
      tableRowBtnFun: [
        {
          name: '修改',
          methodName: 'viewerDialogShow'
        },
        {
          name: '删除',
          methodName: 'delViewer'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 10
      },
      query: {
        keyword: '',
        group_id: null,
        pos: 0, // 当前第n页
        limit: 10, // 每页多少条
        pageNumber: 1
      },
      groupList: [],
      viewerDao: {
        total: 0,
        data: []
      },
      groupDialog: {
        visible: false,
        title: '添加分组',
        type: 'add',
        row: null,
        formLabelWidth: '80px'
      },
      groupForm: {
        subject: ''
      },
      groupFormRules: {
        subject: [
          {required: true, message: '请输入分组名！', trigger: 'blur'},
          {max: 15, message: '请输入分组名（1-15个字符）', trigger: 'blur'},
          {min: 1, message: '请输入分组名（1-15个字符）', trigger: 'blur'}
        ]
      },
      /*----添加观众设置----*/
      viewerDialog: {
        visible: false,
        title: '添加观众',
        type: 'add',
        row: null,
        formLabelWidth: '50px'
      },
      viewerForm: {
        name: '',
        industry: '',
        phone: '',
        job_number: '',
        email: '',
        other: ''
      },
      viewerFormRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {max: 50, message: '请输入姓名（最多50个字符）', trigger: 'blur'},
          {min: 1, message: '请输入姓名（最多50个字符）', trigger: 'blur'}
        ],
        industry: [
          {required: false, message: '请输入行业', trigger: 'blur'},
          {max: 50, message: '请输入行业（最多50个字符）', trigger: 'blur'},
          {min: 1, message: '请输入行业（最多50个字符）', trigger: 'blur'}
        ],
        email: [
          {required: false, message: '请输入邮箱', trigger: 'blur'},
          {pattern: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/, message: '请输入正确的邮箱', trigger: 'blur'},
        ],
        phone: [
          {required: false, message: '请输入手机号码', trigger: 'blur'},
          {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码', trigger: 'blur'},
          {max: 11, message: '请输入正确的手机号码', trigger: 'blur'},
          {min: 1, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        job_number: [
          {required: false, message: '请输入工号（最多50个字符）', trigger: 'blur'},
          {max: 50, message: '请输入工号（最多50个字符）', trigger: 'blur'},
          {min: 1, message: '请输入工号（最多50个字符）', trigger: 'blur'}
        ],
        other: [
          {max: 50, message: '请输入其他内容（最多50个字符）', trigger: 'blur'},
          {min: 1, message: '请输入其他内容（最多50个字符）', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      downloadUrl: `${env.staticLinkVo.tmplDownloadUrl}/download/audience.xlsx`,
      importFileShow: false,
      fileUrl: '', // 文件地址
      fileResult: '', // 文件上传结果
      importResult: null
    };
  },
  computed: {
    pathUrl: function() {
       // return `sys/${window.sessionStorage.getItem('userId')}_v3_${new Date().getTime()}`;
      return `interacts/audience-docs`;
    }
  },
  methods: {
    deleteFile() {
      this.fileUrl = ''
      this.isUploadEnd = false
      this.uploadResult = {
        status: 'start',
        text: '请上传文件'
      }
    },
    fileDownLoad(imgUrl, name) {
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(imgUrl.split(',')[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a')
        a.href = imgUrl
        a.setAttribute('download', 'chart-download')
        a.click()
      }
    },
    downloadTemplate() {
      this.fileDownLoad(this.downloadUrl)
    },
    handleCommand(type, data) {
      type == 'rename' && this.addGroupDialogShow(data)
      type == 'delete' && this.postGroupDel(data)
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
     // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageInfo.pageNum = current;
      this.pageInfo.pos = parseInt((current - 1) * this.pageInfo.limit);
      this.queryList();
    },
    // 复选
    handleSelectionChange(item) {
      this.multipleSelection = item;
    },
    // 展示分组修改
    addGroupDialogShow(item) {
      try{
        if (this.$refs.groupForm) {
          this.$refs.groupForm.resetFields();
        }
      }catch (e){
        console.log(e);
      }
      if(item) { // 重命名
        this.groupDialog.type = 'edit';
        this.groupDialog.title = '重命名';
        this.groupDialog.row = item;
        this.groupForm.subject = item.subject;
        this.groupDialog.visible = true;
      } else { // 创建分组
        this.groupDialog.type = 'add';
        this.groupDialog.title = '添加分组';
        this.groupDialog.row = null;
        this.groupDialog.visible = true;
        this.groupForm.subject = ''
      }
    },
    // 获取白名单分组列表
    audienceGet() {
      let params = {
        user_id: sessionOrLocal.get('userId'),
        pos: 0,
        limit: 1000, // TODO 默认分组查询1000条
      };
      this.$fetch('audienceGet', this.$params(params)).then(res => {
        res && res.code === 200 && res.data && res.data.list ? this.groupList = res.data.list.map(item => {
          item.showHover = false;
          return item;
        }) : this.groupList = [];
        console.log(res);
        // 默认第一个展示
        if (this.groupList.length > 0) {
          this.query.group_id = this.groupList[0].id;
          this.activeGroupIndex = 0;
          this.queryList();
        } else {
          // 若无分组，默认清空列表
          this.query.group_id = null;
          this.viewerDao = {
            total: 0,
            data: []
          };
        }
      }).catch(e => {
        console.log(e);
        this.groupList = [];
      });
    },
    // 白名单创建分组 or 白名单分组重命名
    postGroupSend() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          let params = {
            subject: this.groupForm.subject,
          };
          if (this.groupDialog.type !== 'add') {
            params.group_id = this.groupDialog.row.id;
          }
          this.$fetch(this.groupDialog.type === 'add' ? 'postGroupAdd' : 'postGroupEdit', this.$params(params)).then(res => {
            this.$message({
              message:  `${this.groupDialog.type === 'add' ? '添加分组' : '重命名分组'}操作成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.groupForm.subject = ''
            // 刷新数据
            this.audienceGet();
            this.groupDialog.visible = false;
          }).catch(res => {
             console.log(res);
             this.$message({
              message: res.msg || `${this.groupDialog.type === 'add' ? '添加分组' : '重命名分组'}操作失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }
      });
    },
    // 白名单删除分组
    postGroupDel(item) {
      this.$confirm('确定要删除当前分组？', '删除组', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        let params = {
          group_ids: item.id
        };
        this.$fetch('postGroupDel', this.$params(params)).then(res => {
          this.$message({
            message:  `删除分组-操作成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 重查分组列表
          this.audienceGet();
        }).catch(res => {
          console.log(res);
          this.$message({
            message: res.msg || '删除分组-操作失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      }).catch(() => {
      });
    },
    queryList() {
      if (this.keyword) {
        this.query.pos = 0
        this.pageInfo.pageNum = 1;
      } else {
        this.query.pos = this.pageInfo.pos;
      }
      this.query.limit = 10
      // this.query.pos = 0;
      // this.query.pageNumber = 0;
      // this.query.limit = 10;
      // 表格切换到第一页
      // try {
      //   this.$refs.viewerTable.pageInfo.pageNum = 1;
      //   this.$refs.viewerTable.pageInfo.pos = 0;
      // } catch (e) {
      //   console.log(e);
      // }
      this.viewerList();
    },
    // 白名单根据分组获取观众列表
    viewerList() {
      // if (row) {
      //   this.query.pos = row.pos;
      //   this.query.pageNumber = row.pageNum;
      // }
      this.$fetch('viewerList', this.$params(this.query)).then(res => {
        res && res.code === 200 && res.data && res.data.total > 0 ? this.viewerDao = res.data : this.viewerDao = {
          total: 0,
          data: []
        };
      }).catch((e) => {
        console.log(e);
        this.viewerDao = {
          total: 0,
          data: []
        };
      });
    },
    // 打开导入观众弹出框
    importViewerOpen() {
      // 判断是否有分组
      if(this.query.group_id) {
        this.importFileShow = true;
        this.fileUrl = null;
        this.fileResult = '';
        this.importResult = null;
      } else {
        this.$message({
          message:  `请选择分组`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    },
    // 创建观众
    viewerDialogAdd() {
      // 判断是否有分组
      if(this.query.group_id) {
        this.viewerDialogShow();
      } else {
        this.$message({
          message:  `请选择分组`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    },
    // 展示观众修改
    viewerDialogShow(rows) {
      let item = rows;
      try{
        if (this.$refs.viewerForm) {
          this.$refs.viewerForm.resetFields();
        }
      }catch (e){
        console.log(e);
      }
      if(item) { // 观众信息修改
        this.viewerDialog.type = 'edit';
        this.viewerDialog.title = '观众信息修改';
        this.viewerDialog.row = item;
        this.$set(this.viewerForm, 'name', item.name);
        this.$set(this.viewerForm, 'industry', item.industry);
        this.$set(this.viewerForm, 'phone', item.phone);
        this.$set(this.viewerForm, 'job_number', item.job_number);
        this.$set(this.viewerForm, 'email', item.email);
        this.$set(this.viewerForm, 'other', item.other);
        this.viewerDialog.visible = true;
      } else { // 添加观众
        this.viewerDialog.type = 'add';
        this.viewerDialog.title = '添加观众';
        this.viewerDialog.row = null;
        this.$set(this.viewerForm, 'name', '');
        this.$set(this.viewerForm, 'industry', '');
        this.$set(this.viewerForm, 'phone', '');
        this.$set(this.viewerForm, 'job_number', '');
        this.$set(this.viewerForm, 'email', '');
        this.$set(this.viewerForm, 'other', '');
        this.viewerDialog.visible = true;
      }
    },
    // 白名单添加观众至分组 or 白名单观众信息修改
    viewerSend() {
      this.$refs.viewerForm.validate((valid) => {
        if (valid) {
          console.log('新增 or 修改观众信息：' + JSON.stringify(this.viewerForm));
          let params = Object.assign(this.viewerDialog.type === 'add' ? {group_id: this.query.group_id} : {id: this.viewerDialog.row.id, group_id: this.query.group_id }, this.viewerForm);
          this.$fetch(this.viewerDialog.type === 'add' ? 'viewerAdd' : 'viewerEdit', this.$params(params)).then(res => {
            this.$message({
              message:  `${this.viewerDialog.type === 'add' ? '添加观众' : '观众信息修改'}操作成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.viewerDialog.visible = false;
            // 重查当前分组下观众信息
            this.queryList();
          }).catch(res => {
           console.log(res);
           this.$message({
              message:  res.msg || `${this.viewerDialog.type === 'add' ? '添加观众' : '观众信息修改'}操作失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }
      });
    },
    delViewer(rows) {
      this.$confirm('确定从当前组里删除该观众？', '删除观众', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.sendViewerDel([rows.id]);
      }).catch(() => {
      });
    },
    sendViewerDel(ids) {
      this.$fetch('viewerDel', {
        audience_ids: ids.join(',')
      }).then(res => {
        if(res && res.code === 200) {
          this.$message({
            message:  `删除观众-操作成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // this.$refs.viewerTable.clearSelect();
          this.pageInfo.pageNum = 1;
          this.pageInfo.pos = 0;
          this.queryList();
        } else {
          this.$message({
            message:  res.msg || `删除观众-操作失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      }).catch(res => {
        console.log(e);
        this.$message({
          message:  res.msg || `删除观众-操作失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 白名单观众-批量删除
    viewerDel() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.$confirm('确定从当前组里删除该观众？', '删除观众', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          let ids = this.multipleSelection.map(item => {
            return item.id;
          });
          console.log(`批量删除-观众ID集合为${ids.join(',')}`);
          this.sendViewerDel(ids);
        }).catch(() => {
        });
      } else {
        this.$message({
          message:  '请至少选择一个观众进行删除',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    },
    // 每次改变，重新查询观众信息
    changeViewerList(item, index) {
      this.activeGroupIndex = index;
      this.query.group_id = item.id;
      this.query.keyword = '';
      this.queryList();
    },
    // 文件上传成功
    uploadSuccess(res, file){
      console.log(res, file);
      this.isUploadEnd = true;
      if (res.data.file_url) {
        this.fileUrl = res.data.file_url;
        // 文件上传成功，检测观众
        this.$fetch('viewerImport', {
          file_url: res.data.file_url,
          group_id: this.query.group_id,
          request_type: 0 // 校验
        }).then(resV => {
          this.fileResult = 'success';
          this.uploadResult = {
            status: 'success',
            text: '检测成功'
          }
          this.importResult = {
            success: resV.data.success_count,
            fail: resV.data.fail_count
          };
          if (this.$refs.viewerUpload) {
             this.$refs.viewerUpload.setError('');
          }
        }).catch(res => {
          this.fileResult = 'error';
          this.uploadResult = {
            status: 'error',
            text: res.msg
          }
          // this.$message.error(resV.msg || '检测观众信息失败！');
          this.importResult = null;
          if (this.$refs.viewerUpload) {
             this.$refs.viewerUpload.setError(res.msg || '检测失败，请重新上传');
          }
        });
      }
    },
    beforeUploadHandler(file){
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
          message: `上传文件大小不能超过 2M!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
      this.isUploadEnd = false;
      this.uploadResult = {
        status: 'progress',
        text: '上传中，请稍候'
      }
      this.percent = parseInt(event.percent);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      // this.$message.error(`文件上传失败`);
      this.uploadResult = {
        status: 'error',
        text: '文件上传失败'
      }
      this.fileResult = 'error';
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    closeImportViewer() {
      this.importFileShow = false;
      this.isUploadEnd = false;
      this.fileUrl = '';
      this.uploadResult = {
        status: 'start',
        text: '请上传文件'
      }
    },
    reloadViewerList() {
      if(!this.fileUrl) {
        this.$message({
          message: `请先选择模板`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      // 数据存储
      this.$fetch('viewerImport', {
        file_url: this.fileUrl,
        group_id: this.query.group_id,
        request_type: 1 // 保存
      }).then(resV => {
        /* this.$message({
          message:resV.msg || '导入观众信息成功',
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        }); */
        this.importFileShow = false;
        this.isUploadEnd = false;
        this.fileUrl = '';
        this.uploadResult = {
          status: 'start',
          text: '请上传文件'
        }
        // 刷新列表数据
        this.queryList();
      }).catch(res => {
        this.$message({
          message:res.msg || '导入观众信息失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 下载无效数据
    downErrorHandle() {
      this.$EventBus.$emit('saas_vs_download_change');
      this.$message({
        message: `无效数据导出申请成功，请去下载中心下载`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
      // this.$router.push({path: '/other/downloadList'});
    }
  },
  created() {
    this.audienceGet();
  }
};
</script>

<style lang="less" scoped>
.audienceBox{
  /deep/ .el-dialog__footer{
    padding-top: 0;
  }
  /deep/ .el-table .el-button.el-button--text {
    font-size: 14px;
  }
  /deep/.el-upload--picture-card{
    font-size: 36px;
    i.saasicon_shangchuan{
      font-size: 36px;
    }
    .picInco{
      height: 32px;
    }
  }
  // /deep/ .noPic .saasicon_shangchuan {
  //   font-size: 44px;
  // }

  .down-error {
    font-size: 14px;
    font-weight: 400;
    color: #3562FA;
    text-align: right;
    margin-top: 10px;
    width: 100%;
  }
  /deep/ .el-upload--picture-card {
    width: 100%;
    /*height: 130px;*/
    height: 160px;
  }
  /deep/ .el-dialog__title {
    line-height: 24px;
  }
  /deep/ .dialog-footer {
    .el-button {
      padding: 4px 23px;
    }
  }
  /deep/ .mask span {
    font-size: 14px;
    line-height: 20px;
    i {
      font-size: 18px;
      vertical-align: middle;
      display: inline-block;
    }
  }
}
.uploadtips {
  padding-top: 8px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
}
.operaBox{
  overflow: hidden;
  margin-bottom: 20px;
  .el-link {
    text-decoration: none;
    color: #666666;
    &:hover {
      color: #666666;
    }
  }
  .searchBox{
    float: right;
    .el-input{
      width: 220px;
      .el-input__icon{
        cursor: pointer;
      }
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
    .resetRightBrn {
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/ .el-input__inner {
        border-radius: 20px;
        height: 36px;
        line-height: 36px;
        padding-right: 30px!important;
      }

      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
}
.div__main {
  display: flex;
  align-items: flex-start;
  margin-top: 32px;
}
.table__container {
  width: calc(100% - 224px);
  .padding-table-list2();
  background: #FFFFFF;
  min-height: 640px;
  .viewer_list{
    // min-height: 520px;
    width: 100%;
  }
  .pageBox{
    margin-top: 30px;
  }
  /deep/.el-table__empty-block {
    min-height: 450px;
  }
  /deep/.el-table__fixed-right{
    height: 100% !important;
    &::before{
      background-color: #Fff;
      height: 0;
    }
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dedede;
    border-radius: 5px;
  }
  /deep/ .el-table__body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 5px;
    background: rgba(255,255,255,1);
  }
}
.row__container {
  display: flex;
  margin-bottom: 32px;
}
.group__container {
  width: 210px;
  min-height: 120px;
  background: #FFFFFF;
  border-radius: 4px;
  margin-left: 24px;
  padding: 24px 24px;
  padding-right: 10px;
  max-height: 640px;
  ul {
    max-height: 520px;
    overflow-y: auto;
    position: relative;
    left: 6px;
    // 滚动条的宽度
    &::-webkit-scrollbar {
      width: 6px; // 横向滚动条
      height: 6px; // 纵向滚动条 必写
    }
    // 滚动条的滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      transition: all 0.3s;
      cursor: pointer;
      // display: none;
      // margin-left: 6px;
      background-color: #cccccc;
      &:hover {
        background-color: #cccccc;
      }
      &:active {
        background-color: #cccccc;
      }
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        display: block;
      }
    }
  }
  li {
    list-style-type: none;
    text-align: center;
    margin-bottom: 32px;
  }
  /deep/ .el-dropdown {
    margin-bottom: 12px;
    .el-button:first-child {
      border-right: none;
      text-align: left;
      padding-right: 0;
    }
    .el-button {
      padding: 4px 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:focus {
        color: #666666;
        border-color: #cccccc;
        background-color: #ffffff;
      }
    }
    &.active {
      .el-button {
        border-color:#ffebeb;
        background-color: #ffebeb;
        color: #FB3A32;
      }
    }
    .el-dropdown__caret-button {
      padding: 4px 5px;
      border-left: none;
      &::before {
        width: 0;
      }
    }
    .el-button-group {
      &:hover {
        .el-button {
          background-color: #FB3A32;
          border-color: #FB3A32;
          color: #fff;
        }
      }
    }
    .el-button-group>.el-button {
      border-radius: 23px;
    }
    .el-button-group>.el-button:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      width: 122px;
    }
    .el-button-group>.el-button:last-child {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
}
.group__title {
  color: @font_color_h1;
  margin-bottom: 20px;
}
.group__item--active {
  padding: 8px 0;
  background: @theme--normal;
  color: @font_color_white;
  border-radius: 3px;
}
.group__tap {
  overflow: hidden;
  position: absolute;
  margin-left: 30px;
  margin-top: -56px;
  color: @font_color_h1;
  width: 90px;
  border: 1px solid @border--normal;
  background: @background_white;
  border-radius: 3px;
}
.group_button__rename,.group_button__delete {
  padding: 8px 0;
  cursor: pointer;
}
.group_button__add {
  text-align: left;
  margin-left: 6px;
  color: @font_color_h1;
  cursor: pointer;
  margin-bottom: 12px;
  /deep/ .el-button {
    width: 150px;
  }
}
.download {
  display: block;
  margin: auto;
  line-height: 40px;
  margin-left: 16px;
}
/*弹出框*/
/deep/.el-dialog.dialog__group {
  width: 470px;
  .el-dialog__headerbtn{
    top: 15px;
  }
  .el-dialog__header .el-dialog__title, .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  };
  .el-dialog__header{
    padding: 10px 20px;
    height: 30px;
    line-height: 30px;
  };
};
/*文件按钮*/
.files-btn-wrap {
  display: inline-block;
}
.upload-input {
  display: none;
}
.upload-wrap {
  width: 68px;
  height: 32px;
  position: relative;
}
.resetLabel {
  margin: 0;
  height: 36px;
}
.upload-dialog-content {
  overflow: hidden;
}
.dialog-right-btn {
  text-align: right;
  margin-bottom: 24px;
  margin-top: 22px;
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
  color: #FB3A32;
  font-size: 14px;
}
/deep/.el-progress__text /deep/i {
  font-size: 18px;
}
.progressBox {
  /deep/ .el-progress-bar__inner {
    background-color: #14BA6A;
  }
}

.dev-show-tips {
  font-size: 14px;
  font-weight: 400;
  color:#999999;
  line-height: 20px;
  a {
    color: #3562FA;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
