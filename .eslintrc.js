module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    BMap: true,
    Vhall: true,
    VhallInteraction: true,
    VhallRTC: true,
    VhallPlayer: true,
    VHall_Questionnaire_Service: true,
    VHall_Questionnaire_Const: true,
    VHPublisher: true,
    VHDocSDK: true,
    VhallChat: true,
    VhallReport: true,
    $: true,
    wx: true,
    WeixinJSBridge: true
  },
  rules: {
    semi: [1],
    'no-unused-vars': [0],
    'no-undef': [0],
    eqeqeq: [0],
    camelcase: 0,
    'space-before-function-paren': [0],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [
      1,
      {
        'x-invalid-end-tag': false,
        'invalid-first-character-of-tag-name': false
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
