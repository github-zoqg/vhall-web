let filedJson = {
  radio: {
    "label": "单选题",
    "required": false,
    "bottomBtn": ["addBtn", "delete", "move", "requireSwtich"],
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
    "bottomBtn": ["addBtn", "delete", "move", "requireSwtich"],
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
    "label": "问答题",
    "required": true,
    "bottomBtn": ["addBtn", "delete", "move", "requireSwtich"],
    "type": "input",
    "nodes": [
      {
        props: {
          maxlength: "50",
          "show-word-limit": true,
          placeholder: "选项",
          class: ['selectInput']
        },
        "value":""
      },
      {
        props: {
          maxlength: "50",
          "show-word-limit": true,
          placeholder: "选项",
          class: ['selectInput']
        },
        "value":""
      }
    ]
  },
  input: {
    "label": "问答题",
    "required": true,
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
  // "name": {
  //   "label": "姓名",
  //   "required": true,
  //   "bottomBtn": ["move"],
  //   "type": "input",
  //   "nodes": [
  //     {
  //       "props": {},
  //       "value":""
  //     }
  //   ]
  // },
  // "phone": {
  //   "label": "手机号",
  //   "required": true,
  //   "bottomBtn": ["move", "phoneValid"],
  //   "type": "input",
  //   "nodes": [
  //     {
  //       "props": {},
  //       "value":""
  //     }
  //   ]
  // },
  // "gender": {
  //   "label": "性别",
  //   "required": false,
  //   "bottomBtn": ["delete", "move", "requireSwtich"],
  //   "type": "radio",
  //   "nodes": [
  //     {
  //       "props": {},
  //       "value":"",
  //       "children": [
  //         {"value": "男"},
  //         {"value": "女"}
  //       ]
  //     }
  //   ]
  // },
  // "email": {
  //   "label": "邮箱",
  //   "required": false,
  //   "bottomBtn": ["delete", "move", "requireSwtich"],
  //   "type": "input",
  //   "nodes": [
  //     {
  //       "props": {},
  //       "value":""
  //     }
  //   ]
  // },
  // "company": {
  //   "label": "邮箱",
  //   "required": false,
  //   "bottomBtn": ["delete", "move", "requireSwtich"],
  //   "type": "input",
  //   "nodes": [
  //     {
  //       "props": {},
  //       "value":""
  //     }
  //   ]
  // }
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
        json.nodes[0].children[0].value = '女';

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
