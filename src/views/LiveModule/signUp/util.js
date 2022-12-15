let filedJson = {
  radio: {
    label: '单选题',
    required: true,
    reporType: 100160,
    bottomBtn: ['addBtn', 'addOther', 'delete', 'move', 'requireSwtich'],
    type: 'radio',
    value: '',
    nodes: [
      {
        props: {},
        value: '',
        children: [{ value: '' }, { value: '' }]
      }
    ],
    reqType: 2,
    default_type: ''
  },
  checkBox: {
    label: '多选题',
    required: true,
    bottomBtn: ['addBtn', 'addOther', 'delete', 'move', 'requireSwtich'],
    type: 'checkBox',
    reporType: 100166,
    value: '',
    nodes: [
      {
        props: {},
        value: [],
        children: [{ value: '' }, { value: '' }]
      }
    ],
    reqType: 3,
    default_type: ''
  },
  select: {
    label: '下拉题',
    required: true,
    bottomBtn: ['addBtn', 'delete', 'move', 'requireSwtich'],
    type: 'select',
    reporType: 100176,
    value: '',
    nodes: [
      {
        props: {
          maxlength: '50',
          'show-word-limit': true,
          placeholder: '选项',
          class: ['selectInput']
        },
        canRemove: true,
        value: ''
      },
      {
        props: {
          maxlength: '50',
          'show-word-limit': true,
          placeholder: '选项',
          class: ['selectInput']
        },
        canRemove: true,
        value: ''
      }
    ],
    reqType: 4,
    default_type: ''
  },
  input: {
    label: '问答题',
    required: true,
    reporType: 100172,
    bottomBtn: ['delete', 'move', 'requireSwtich'],
    type: 'input',
    value: '',
    nodes: [
      {
        props: {
          placeholder: '请输入答案'
        },
        value: ''
      }
    ],
    reqType: 1,
    default_type: '',
    disabledEdit: true
  },
  inputs: {
    label: '小结',
    required: false,
    bottomBtn: ['delete', 'move', 'requireSwtich'],
    type: 'input',
    value: '',
    nodes: [
      {
        props: {
          placeholder: '请输入总结'
        },
        value: ''
      }
    ]
  },
  privacy: {
    reporType: 100181
  }
};
export function getfiledJson({ name, type }) {
  let json = '';
  if (name) {
    switch (name) {
      case 'name':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入姓名';
        json = Object.assign(json, {
          label: '名字',
          required: true,
          bottomBtn: ['move'],
          reqType: 0,
          default_type: 1,
          subject: '名字',
          disabledEdit: true
        });

        break;
      case 'phone':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入手机号';
        json = Object.assign(json, {
          label: '手机号',
          required: true,
          bottomBtn: ['phoneValid'],
          reqType: 0,
          default_type: 2,
          subject: '手机号',
          phoneValide: true,
          abroadPhoneValide: false,
          disabledEdit: true
        });

        break;
      case 'birthday':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入生日';
        json = Object.assign(json, {
          label: '生日',
          required: true,
          bottomBtn: ['move', 'phoneValid'],
          disabledEdit: false
        });

        break;

      case 'gender':
        json = JSON.parse(JSON.stringify(filedJson['radio']));
        json.nodes[0].children[0].value = '男';
        json.nodes[0].children[1].value = '女';

        json = Object.assign(json, {
          label: '性别',
          reporType: 100140,
          required: true,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          reqType: 0,
          default_type: 4,
          subject: '性别'
        });

        break;

      case 'email':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入邮箱号';
        json = Object.assign(json, {
          label: '邮箱',
          required: true,
          reqType: 0,
          reporType: 100144,
          default_type: 3,
          subject: '邮箱',
          disabledEdit: true
        });

        break;

      case 'company':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入公司名称';
        json = Object.assign(json, {
          label: '公司',
          required: true,
          reporType: 100152,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          options: {
            type: 7
          },
          disabledEdit: true
        });

        break;
      case 'industry':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json.nodes[0].props.placeholder = '请输入行业名称';
        json = Object.assign(json, {
          label: '行业',
          required: true,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          disabledEdit: false
        });

        break;

      case 'regional':
        json = JSON.parse(JSON.stringify(filedJson['select']));
        json = Object.assign(json, {
          label: '地域',
          required: true,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          nodes: ['省/自治区/直辖市', '市', '区/县'].map((item, index) => {
            return {
              props: {
                disabled: true,
                placeholder: item,
                class: ['selectInput', 'regionalInput']
              },
              value: '',
              index
            };
          }),
          reqType: 5,
          reporType: 100148,
          default_type: '',
          options: {
            show_country: 1,
            show_province: 1,
            show_city: 1,
            show_district: 1
          },
          disabledEdit: true
        });

        break;

      case 'duty':
        json = JSON.parse(JSON.stringify(filedJson['select']));

        json = Object.assign(json, {
          label: '职务',
          required: true,
          reporType: 100156,
          // "bottomBtn": [,"delete", "move", "requireSwtich"],
          nodes: [
            '首席执行官/总经理',
            '首席信息官/IT经理',
            '市场总监/经理',
            '销售总监/经理',
            '技术总监/经理',
            '工程技术人员',
            '其他'
          ].map(item => {
            return {
              props: {
                placeholder: '选项',
                class: ['selectInput']
              },
              canRemove: true,
              value: item
            };
          }),
          options: {
            item_list: [
              '首席执行官/总经理',
              '首席信息官/IT经理',
              '市场总监/经理',
              '销售总监/经理',
              '技术总监/经理',
              '工程技术人员',
              '其他'
            ],
            question_subject: '职务',
            immutable: true
          }
        });

        break;

      case 'educational':
        json = JSON.parse(JSON.stringify(filedJson['select']));

        json = Object.assign(json, {
          label: '教育水平',
          required: true,
          // "bottomBtn": [,"delete", "move", "requireSwtich"],
          nodes: ['博士', '研究生', '本科', '专科', '其他'].map(item => {
            return {
              props: {
                disabled: item != '其他',
                placeholder: '选项',
                class: ['selectInput']
              },
              canRemove: true,
              value: item
            };
          })
        });

        break;

      case 'privacy':
        json = JSON.parse(JSON.stringify(filedJson['input']));
        json = Object.assign(json, {
          label: '隐私声明',
          required: true,
          bottomBtn: ['delete', 'requireSwtich'],
          privacy: true,
          reporType: 100181,
          nodes: [
            {
              key: 'content',
              props: {
                class: ['radioInput'],
                placeholder: '我们根据《隐私声明》保护您填写的所有信息'
              },
              value: '我们根据《隐私声明》保护您填写的所有信息'
            },
            {
              key: 'color_text',
              props: {
                class: ['radioInput'],
                placeholder: '请输入第1行中包含的文字才能实现跳转效果'
              },
              value: '《隐私声明》',
              privacyAdd: true
            },
            {
              key: 'url',
              props: {
                placeholder: '请输入以http://或https://开头的链接'
              },
              value: ''
            }
          ],
          reqType: 6,
          default_type: '',
          disabledEdit: false
        });
        break;

      default:
        break;
    }
    json.name = name;
  } else {
    json = JSON.parse(JSON.stringify(filedJson[type]));
    json.labelEditable = true;
  }
  return json;
}
