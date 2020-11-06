let filedJson = {
  radio: {
    "label": "单选题",
    "required": false,
    "bottomBtn": ["addBtn", "addOther", "delete", "move", "requireSwtich"],
    "type": "radio",
    "nodes": [
      {
        "props": {},
        "value":"",
        "children": [
          {"value": ""},
          {"value": ""}
        ]
      }
    ]
  },
  checkBox: {
    "label": "多选题",
    "required": false,
    "bottomBtn": ["addBtn", "addOther", "delete", "move", "requireSwtich"],
    "type": "checkBox",
    value: '',
    "nodes": [
      {
        "props": {},
        "value":"",
        "children": [
          {"value": ""},
          {"value": ""}
        ]
      }
    ]
  },
  select: {
    "label": "下拉题",
    "required": false,
    "bottomBtn": ["addBtn", "delete", "move", "requireSwtich"],
    "type": "input-select",
    "nodes": [
      {
        props: {
          maxlength: "50",
          "show-word-limit": true,
          placeholder: "选项",
          class: ['selectInput']
        },
        canRemove: true,
        "value":""
      },
      {
        props: {
          maxlength: "50",
          "show-word-limit": true,
          placeholder: "选项",
          class: ['selectInput']
        },
        canRemove: true,
        "value":""
      }
    ]
  },
  input: {
    "label": "问答题",
    "required": false,
    "bottomBtn": ["delete", "move", "requireSwtich"],
    "type": "input",
    "nodes": [
      {
        "props": {},
        "value":""
      }
    ]
  },
  privacy: {

  }
};
export function getfiledJson({name, type}){
  let json = '';
  console.log(11, name, type);
  if(name){
    switch (name) {
      case 'name':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '名字',
          "required": true,
          "bottomBtn": ["move"],
        });

        break;
      case 'phone':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '手机号',
          "required": true,
          "bottomBtn": ["move", "phoneValid"],
        });

        break;

      case 'gender':
        json = JSON.parse(JSON.stringify(filedJson['radio']));
        json.nodes[0].children[0].value = '男';
        json.nodes[0].children[1].value = '女';

        json = Object.assign(json, {
          label: '性别',
          "required": false,
          "bottomBtn": ["delete", "move", "requireSwtich"],
        });

        break;

      case 'email':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '邮箱',
          "required": true,
        });

        break;

      case 'company':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '公司',
          "required": true,
          "bottomBtn": ["delete", "move", "requireSwtich"],
        });

        break;

      case 'regional':
        json = JSON.parse(JSON.stringify(filedJson['select']));
        json = Object.assign(json, {
          label: '地域',
          "required": true,
          "bottomBtn": ["delete", "move", "requireSwtich"],
          "nodes": ["省/自治区/直辖市", "市", "区/县"].map(item=>{
            return {
              props: {
                disabled: true,
                placeholder: item,
                class: ['selectInput']
              },
              "value":""
            };
          })
        });

        break;

      case 'duty':
        json = JSON.parse(JSON.stringify(filedJson['select']));

        json = Object.assign(json, {
          label: '职务',
          "required": true,
          // "bottomBtn": [,"delete", "move", "requireSwtich"],
          "nodes": ["首席执行官/总经理", "市场总监/经理", "销售总监/经理", "工程技术人员", "其他"].map(item=>{
            return {
              props: {
                disabled: item !='其他',
                placeholder: "选项",
                class: ['selectInput']
              },
              canRemove: true,
              "value": item
            };
          })
        });

        break;

      case 'privacy':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '隐私声明',
          "required": true,
          "bottomBtn": ["delete", "move", "requireSwtich"],
          privacy: true,
          "nodes": [
            {
              "props": {
                class: ['radioInput']
              },
              "value":"我们根据《隐私声明》保护您填写的所有信息"
            },
            {
              "props": {
                class: ['radioInput'],
                placeholder: '请输入第一行中可点击跳转得文字'
              },
              "value":"《隐私声明》",
              privacyAdd: true
            },
            {
              "props": {
                placeholder: '跳转链接（可选）'
              },
              "value":""
            },
          ]
        });
        break;


      default:
        break;
    }
    json.name = name;
    console.log(1123123, json);
  }else{
    json = JSON.parse(JSON.stringify(filedJson[type]));
  }
  return JSON.parse(JSON.stringify(json));
}
