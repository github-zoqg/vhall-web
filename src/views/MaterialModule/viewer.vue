<template>
  <div class="audienceBox">
    <pageTitle title="观众">
      <div slot="content">
        单个文件不可超过5000条数据，数据量较大时请拆分文件上传
      </div>
    </pageTitle>
    <div class="div__main">
      <div class="table__container">
        <!-- 操作栏 -->
        <div class="operaBox">
          <el-button type="primary" round @click.prevent.stop="viewerDialogAdd" size="medium">新增观众</el-button>
          <el-button round @click.prevent.stop="importViewerOpen" size="medium">导入观众</el-button>
          <el-button round :disabled="multipleSelection.length == 0" @click.prevent.stop="viewerDel" size="medium">批量删除</el-button>
          <el-link :href="downloadUrl"  v-if="downloadUrl" class="unHover">下载模版</el-link>
          <el-link :href="downloadUrl" v-else  class="unHover">下载模板</el-link>
          <div class="searchBox">
            <VhallInput
              placeholder="搜索内容"
              v-model="query.keyword"
              clearable
              @keyup.enter.native="queryList"
              @clear="queryList">
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="queryList">
              </i>
            </VhallInput>
          </div>
        </div>
        <!-- 操作栏 -->
        <table-list
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
          v-if="viewerDao && viewerDao.total > 0"
        >
        </table-list>
        <!-- 无消息内容 -->
        <null-page v-else></null-page>
      </div>
      <div  class="group__container">
        <p class="group__title">全部分组</p>
        <ul v-if="groupList && groupList.length > 0">
          <li class="group__item--active"  v-for="(item, ins) in groupList" :key="`group${ins}`" @click.prevent.stop="changeViewerList(item)">
            <span class="group__button__title" @mouseover="item.showHover = true" @mouseout="item.showHover = false">{{ item.subject }}</span>
            <div class="group__tap" v-show="item.showHover"  @mouseover="item.showHover = true" @mouseout="item.showHover = false">
              <div class="group_button__rename" @click.prevent.stop="addGroupDialogShow(item)">重命名</div>
              <div class="group_button__delete" @click.prevent.stop="postGroupDel(item)">删除</div>
            </div>
          </li>
        </ul>
        <div class="group_button__add" @click.prevent.stop="addGroupDialogShow(null)">
          <span class="add-icon">+</span><span>点击添加分组</span>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!-- 添加分组/ 重命名分组 -->
    <VhallDialog :title="groupDialog.title" :visible.sync="groupDialog.visible" :lock-scroll='false' width="420px">
      <el-form :model="groupForm" ref="groupForm" :rules="groupFormRules" :label-width="groupDialog.formLabelWidth">
        <el-form-item label="分组名：" prop="subject">
          <VhallInput v-model.trim="groupForm.subject" auto-complete="off" placeholder="请输入分组名（1-15个字符）" :maxlength="15"
                    :minlength="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postGroupSend('groupForm')" round size="medium">确 定</el-button>
        <el-button @click="groupDialog.visible = false" round size="medium">取 消</el-button>
      </div>
    </VhallDialog>
    <!-- 添加观众/ 观众修改 -->
    <VhallDialog :title="viewerDialog.title" :visible.sync="viewerDialog.visible" :lock-scroll='false' width="544px">
      <el-form :model="viewerForm" ref="viewerForm" :rules="viewerFormRules" :label-width="viewerDialog.formLabelWidth">
        <el-form-item label="姓名：" prop="name">
          <VhallInput v-model.trim="viewerForm.name" auto-complete="off" placeholder="请输入姓名（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="行业：" prop="industry">
          <VhallInput v-model.trim="viewerForm.industry" auto-complete="off" placeholder="请输入行业（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <VhallInput v-model.trim="viewerForm.email" auto-complete="off" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <VhallInput v-model.trim="viewerForm.phone" auto-complete="off" placeholder="请输入手机号码" :maxlength="11"/>
        </el-form-item>
        <el-form-item label="工号：" prop="job_number">
          <VhallInput v-model.trim="viewerForm.job_number" auto-complete="off" placeholder="请输入工号（最多50个字符）" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="其他：" prop="other">
          <VhallInput v-model.trim="viewerForm.other" auto-complete="off" placeholder="请输入其他内容（最多50个字符）" :maxlength="50"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewerSend('viewerForm')" size="medium" round>确 定</el-button>
        <el-button @click="viewerDialog.visible = false" size="medium" round>取 消</el-button>
      </div>
    </VhallDialog>
    <!-- 导入观众excel -->
    <VhallDialog title="导入观众" :lock-scroll='false' :visible.sync="importFileShow" width="468px">
      <div class="upload-dialog-content">
        <file-upload
          ref="viewerUpload"
          v-model="fileUrl"
          :saveData="{
             path: pathUrl,
             type: 'exel',
          }"
          :result="importResult"
          :fileResult=fileResult
          :progress="{
            isUploadEnd: isUploadEnd,
            percent: percent
          }"
          :on-success="uploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler">
          <p slot="tip" v-if="!isUploadEnd && percent === 0">请使用模版上传文件</p>
          <p slot="tip" v-if="!isUploadEnd && percent > 0"><el-progress :percentage="percent" status="success"></el-progress></p>
        </file-upload>
        <div class="dialog-right-btn">
          <el-button type="primary" @click="reloadViewerList" size="medium" round :disabled="fileResult === 'error'">确 定</el-button>
          <el-button @click="closeImportViewer" size="medium" round>取 消</el-button>
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
      isUploadEnd: false,
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
        formLabelWidth: '100px'
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
        formLabelWidth: '100px'
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
          {required: true, message: '请输入手机号码', trigger: 'blur'},
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
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 复选
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
            if(res && res.code === 200) {
              this.$message.success(`${this.groupDialog.type === 'add' ? '添加分组' : '重命名分组'}操作成功`);
              // 刷新数据
              this.audienceGet();
            } else {
              this.$message({
                type: 'error',
                message: res.msg || `${this.groupDialog.type === 'add' ? '添加分组' : '重命名分组'}操作失败`
              });
            }
            this.groupDialog.visible = false;
          }).catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message:`${this.groupDialog.type === 'add' ? '添加分组' : '重命名分组'}操作失败`
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
          if(res && res.code === 200) {
            this.$message.success(`删除分组-操作成功`);
            // 重查分组列表
            this.audienceGet();
          } else {
            this.$message({
              type: 'error',
              message: res.msg || '删除分组-操作失败'
            });
          }
        }).catch(e => {
          console.log(e);
          this.$message({
            type: 'error',
            message:  '删除分组-操作失败'
          });
        });
      }).catch(() => {
      });
    },
    queryList() {
      this.query.pos = 0;
      this.query.pageNumber = 0;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.viewerTable.pageInfo.pageNum = 1;
        this.$refs.viewerTable.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.viewerList();
    },
    // 白名单根据分组获取观众列表
    viewerList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
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
        this.$message.error('请选择分组');
      }
    },
    // 创建观众
    viewerDialogAdd() {
      // 判断是否有分组
      if(this.query.group_id) {
        this.viewerDialogShow(this, {rows: null});
      } else {
        this.$message.error('请选择分组');
      }
    },
    // 展示观众修改
    viewerDialogShow(that, { rows }) {
      let item = rows;
      try{
        if (that.$refs.viewerForm) {
          that.$refs.viewerForm.resetFields();
        }
      }catch (e){
        console.log(e);
      }
      if(item) { // 观众信息修改
        that.viewerDialog.type = 'edit';
        that.viewerDialog.title = '观众信息修改';
        that.viewerDialog.row = item;
        that.$set(that.viewerForm, 'name', item.name);
        that.$set(that.viewerForm, 'industry', item.industry);
        that.$set(that.viewerForm, 'phone', item.phone);
        that.$set(that.viewerForm, 'job_number', item.job_number);
        that.$set(that.viewerForm, 'email', item.email);
        that.$set(that.viewerForm, 'other', item.other);
        that.viewerDialog.visible = true;
      } else { // 添加观众
        that.viewerDialog.type = 'add';
        that.viewerDialog.title = '添加观众';
        that.viewerDialog.row = null;
        that.$set(that.viewerForm, 'name', '');
        that.$set(that.viewerForm, 'industry', '');
        that.$set(that.viewerForm, 'phone', '');
        that.$set(that.viewerForm, 'job_number', '');
        that.$set(that.viewerForm, 'email', '');
        that.$set(that.viewerForm, 'other', '');
        that.viewerDialog.visible = true;
      }
    },
    // 白名单添加观众至分组 or 白名单观众信息修改
    viewerSend() {
      this.$refs.viewerForm.validate((valid) => {
        if (valid) {
          console.log('新增 or 修改观众信息：' + JSON.stringify(this.viewerForm));
          let params = Object.assign(this.viewerDialog.type === 'add' ? {group_id: this.query.group_id} : {id: this.viewerDialog.row.id, group_id: this.query.group_id }, this.viewerForm);
          this.$fetch(this.viewerDialog.type === 'add' ? 'viewerAdd' : 'viewerEdit', this.$params(params)).then(res => {
            if(res && res.code === 200) {
              this.$message.success(`${this.viewerDialog.type === 'add' ? '添加观众' : '观众信息修改'}操作成功`);
              this.viewerDialog.visible = false;
              // 重查当前分组下观众信息
              this.queryList();
            } else {
              this.$message({
                type: 'error',
                message: res.msg || `${this.viewerDialog.type === 'add' ? '添加观众' : '观众信息修改'}操作失败`
              });
            }
          }).catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message:`${this.viewerDialog.type === 'add' ? '添加观众' : '观众信息修改'}操作失败`
            });
          });
        }
      });
    },
    delViewer(that, { rows }) {
      that.$confirm('确定从当前组里删除该观众？', '删除观众', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.sendViewerDel([rows.id]);
      }).catch(() => {
      });
    },
    sendViewerDel(ids) {
      this.$fetch('viewerDel', {
        audience_ids: ids.join(',')
      }).then(res => {
        if(res && res.code === 200) {
          this.$message.success(`删除观众-操作成功`);
          this.$refs.viewerTable.clearSelect();
          this.queryList();
        } else {
          this.$message({
            type: 'error',
            message: res.msg || '删除观众-操作失败'
          });
        }
      }).catch(e => {
        console.log(e);
        this.$message({
          type: 'error',
          message: '删除观众-操作失败'
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
          type: 'error',
          message: '请至少选择一个观众进行删除'
        });
      }
    },
    // 每次改变，重新查询观众信息
    changeViewerList(item) {
      this.query.group_id = item.id;
      this.queryList();
    },
    // 文件上传成功
    uploadSuccess(res, file){
      console.log(res, file);
      this.percent = 0;
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
          this.importResult = {
            success: resV.data.success_count,
            fail: resV.data.fail_count
          };
          if (this.$refs.viewerUpload) {
             this.$refs.viewerUpload.setError('');
          }
        }).catch(e => {
          this.fileResult = 'error';
          // this.$message.error(resV.msg || '检测观众信息失败！');
          this.importResult = null;
          if (this.$refs.viewerUpload) {
             this.$refs.viewerUpload.setError('检测失败，请重新上传');
          }
        });
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['csv', 'xls', 'xlsx'];
      let nameArr = file.name.split('.');
      const isType = typeList.includes(nameArr[nameArr.length - 1]); // typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传格式只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!');
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
      this.isUploadEnd = false;
      this.percent = parseInt(event.percent);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      // this.$message.error(`文件上传失败`);
      this.fileResult = 'error';
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    closeImportViewer() {
      this.importFileShow = false;
      this.percent = 0;
      this.isUploadEnd = false;
      this.fileUrl = '';
    },
    reloadViewerList() {
      if(!this.fileUrl) {
        this.$message.error('请先选择模板');
        return;
      }
      // 数据存储
      this.$fetch('viewerImport', {
        file_url: this.fileUrl,
        group_id: this.query.group_id,
        request_type: 1 // 保存
      }).then(resV => {
        if (resV && resV.code === 200) {
          this.importFileShow = false;
          this.percent = 0;
          this.isUploadEnd = false;
          this.fileUrl = '';
          // 刷新列表数据
          this.queryList();
        } else {
          this.$message.error(resV.msg || '导入观众信息失败！');
        }
      }).catch(e => {
        this.$message.error(e.msg || '导入观众信息失败！');
      });
    },
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
}
.operaBox{
  overflow: hidden;
  margin-bottom: 20px;
  .el-link {
    margin-left: 20px;
    margin-left: 20px;
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
  }
}
.div__main {
  display: flex;
  align-items: flex-start;
  margin-top: 32px;
}
.table__container {
  width: calc(100% - 256px);
  .padding-table-list2();
  background: #FFFFFF;
  min-height: 500px;
}
.row__container {
  display: flex;
  margin-bottom: 32px;
}
.group__container {
  width: 200px;
  min-height: 120px;
  background: #FFFFFF;
  border-radius: 4px;
  margin-left: 32px;
  padding: 24px 24px;
  li {
    list-style-type: none;
    text-align: center;
    margin-bottom: 32px;
  }
}
.group__title {
  color: @font_color_h1;
  margin-bottom: 32px;
  text-align: center;
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
  text-align: center;
  color: @font_color_h1;
  cursor: pointer;
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
  margin-top: 24px;
}
</style>
