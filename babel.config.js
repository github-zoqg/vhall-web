const transformRemoveConsolePlugin = []
if (process.env.VUE_APP_NODE_ENV === 'production') {
  transformRemoveConsolePlugin.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins:[
    ...transformRemoveConsolePlugin
  ]
};
