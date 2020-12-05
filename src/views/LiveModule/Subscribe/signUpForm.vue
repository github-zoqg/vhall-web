<template>
  <div class="signFormBox">
    <div class="signWrap">
      <signUp
        :baseInfo="baseInfo"
        :questionArr.sync="questionArr"
        @closePreview="closePreview"
      ></signUp>
    </div>
  </div>
</template>

<script>
  import signUp from '../signUp/signUpForm';
  export default {
    components: {
      signUp
    },
    data() {
      return {
        questionArr: [
          {
            "label": "名字",
            "required": true,
            "bottomBtn": [],
            "type": "input",
            "value": "",
            "nodes": [{
              "props": {
                "placeholder": "请输入姓名"
              },
              "value": ""
            }],
            "reqType": 0,
            "default_type": 1,
            "subject": "名字",
            "name": "name",
            "question_id": 6085
          }, {
            "label": "性别",
            "required": false,
            "bottomBtn": ["delete", "move", "requireSwtich"],
            "type": "radio",
            "value": "",
            "nodes": [{
              "props": {},
              "value": "",
              "children": [{
                "value": "男"
              }, {
                "value": "女"
              }]
            }],
            "reqType": 0,
            "default_type": 4,
            "subject": "性别",
            "name": "gender",
            "question_id": 4019
          }, {
            "label": "单选题",
            "required": false,
            "bottomBtn": ["addBtn", "addOther", "delete", "move", "requireSwtich"],
            "type": "radio",
            "value": "",
            "nodes": [{
              "props": {},
              "value": "",
              "children": [{
                "value": ""
              }, {
                "value": ""
              }]
            }],
            "reqType": 2,
            "default_type": "",
            "labelEditable": true,
            "question_id": 5070
          }, {
            "label": "多选题",
            "required": false,
            "bottomBtn": ["addBtn", "addOther", "delete", "move", "requireSwtich"],
            "type": "checkBox",
            "value": "",
            "nodes": [{
              "props": {},
              "value": [],
              "children": [{
                "value": ""
              }, {
                "value": ""
              }]
            }],
            "reqType": 3,
            "default_type": "",
            "labelEditable": true,
            "question_id": 7999
          }, {
            "label": "问答题",
            "required": false,
            "bottomBtn": ["delete", "move", "requireSwtich"],
            "type": "input",
            "value": "",
            "nodes": [{
              "props": {
                "placeholder": "请输入答案"
              },
              "value": ""
            }],
            "reqType": 1,
            "default_type": "",
            "labelEditable": true,
            "question_id": 6874
          }, {
            "label": "职务",
            "required": true,
            "bottomBtn": ["addBtn", "delete", "move", "requireSwtich"],
            "type": "select",
            "value": "",
            "nodes": [{
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "首席执行官/总经理"
            }, {
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "首席信息官/IT经理"
            }, {
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "市场总监/经理"
            }, {
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "销售总监/经理"
            }, {
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "销售总监/经理"
            }, {
              "props": {
                "disabled": true,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "工程技术人员"
            }, {
              "props": {
                "disabled": false,
                "placeholder": "选项",
                "class": ["selectInput"]
              },
              "canRemove": true,
              "value": "其他"
            }],
            "reqType": 4,
            "default_type": "",
            "options": {
              "item_list": ["首席执行官/总经理", "首席信息官/IT经理", "市场总监/经理", "销售总监/经理", "销售总监/经理", "工程技术人员", "其他"],
              "question_subject": "职务",
              "immutable": true
            },
            "name": "duty",
            "question_id": 2559
          }, {
            "label": "公司",
            "required": true,
            "bottomBtn": ["delete", "move", "requireSwtich"],
            "type": "input",
            "value": "",
            "nodes": [{
              "props": {
                "placeholder": "请输入公司名称"
              },
              "value": ""
            }],
            "reqType": 1,
            "default_type": "",
            "options": {
              "type": 7
            },
            "name": "company",
            "question_id": 7053
          }, {
            "label": "地域",
            "required": true,
            "bottomBtn": ["delete", "move", "requireSwtich"],
            "type": "select",
            "value": "",
            "nodes": [{
              "props": {
                "disabled": true,
                "placeholder": "省/自治区/直辖市",
                "class": ["selectInput"]
              },
              "value": ""
            }, {
              "props": {
                "disabled": true,
                "placeholder": "市",
                "class": ["selectInput"]
              },
              "value": ""
            }, {
              "props": {
                "disabled": true,
                "placeholder": "区/县",
                "class": ["selectInput"]
              },
              "value": ""
            }],
            "reqType": 5,
            "default_type": "",
            "options": {
              "show_country": 0,
              "show_province": 1,
              "show_city": 1,
              "show_district": 1
            },
            "name": "regional",
            "question_id": 3362
          }, {
            "label": "邮箱",
            "required": true,
            "bottomBtn": ["delete", "move", "requireSwtich"],
            "type": "input",
            "value": "",
            "nodes": [{
              "props": {
                "placeholder": "请输入邮箱号"
              },
              "value": ""
            }],
            "reqType": 0,
            "default_type": 3,
            "subject": "邮箱",
            "name": "email",
            "question_id": 7815
          }, {
            "label": "手机号",
            "required": true,
            "bottomBtn": ["phoneValid"],
            "type": "input",
            "value": "",
            "nodes": [{
              "props": {
                "placeholder": "请输入手机号"
              },
              "value": ""
            }],
            "reqType": 0,
            "default_type": 2,
            "subject": "手机号",
            "name": "phone",
            "question_id": 6204
          }
        ],
        baseInfo: {
          "open_link": 0,
          "theme_color": "red",
          "tab_verify_title": "验证",
          "tab_form_title": "用户报名",
          "form_title": "ddassd",
          "form_introduce": "",
          "form_cover": "sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png"
        }
      };
    },
    methods: {
      closePreview() {
        this.$emit('closeSignUp');
      },
    }
  };
</script>

<style lang="less" scoped>
  .signFormBox {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    .signWrap {
      overflow-y: auto;
      height: 843px;
    }
  }
</style>
