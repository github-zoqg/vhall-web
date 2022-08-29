# saas-v3-web

> saas控制台项目

## 工程说明

1. 该工程是B用户控制台项目。
2. 所有项项目统一使用 vue2.x 开发,为了兼容 IE11。
3. 项目使用vue-cli4搭建结构
4. 名词解释：

## 安装依赖
```
yarn install
```

### 开发本地时的启动命令
```
npm run serve
```

### 生产环境构建命令
```
(本地打包)
npm run build 

(真对运维jenkins打包使用以下命令)
./node_modules/.bin/vue-cli-service --mode 环境标识 --hash 代码提交的commitId
```

### 运行单元测试用例
```
npm run test:unit
```

### lint检查和修复代码格式问题
```
npm run lint
```

### 通用的详细配置
1、  公共的以写的分页、table列表
2、See [Configuration Reference](https://cli.vuejs.org/config/).
