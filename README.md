### 技术栈

系统前台模块采用 `vue + element-ui`进行开发，使用 `eslint + prettier`进行语法检测，样式预编译采用`scss`。

```
框架：vue@2.5.17
请求：axios@0.18.0
UI： element-ui@2.4.9
图表：v-charts@1.19.0
路由：vue-router@3.0.1
状态管理：vuex@3.0.1
富文本：wangeditor@3.1.1
样式：scss@0.2.4
语法检测：eslint@5.8.0
格式化: prettier@4.0.0
存储：local-storage@1.4.2
地图：vue-amap@0.5.8
```

### 项目操作
```
// 依赖安装
yarn install  || npm install

// 启动
yarn run serve || npm run serve

// 发布
yarn run build || npm run build

// 测试
yarn run test || npm run test

// 修复
yarn run lint || npm run lint
```

### 数据交互

1、数据获取方式 `异步请求`，返回格式为 `JSON`
2、异步请求返回通用格式：

```
{
    "code": 0,
    "message": "请求成功",
    "data": []
}
code码定义：
0       请求成功
1***    业务层状态码
2***    服务层状态码
```
3、登录认证方式：

4、mock数据
`mock` 数据使用 `mock.js`进行模拟，为使用方便采取第三方数据模拟网站进行数据`mock` [mock地址](https://easy-mock.com/project/5bf22122dfdf50608b922e47)。

### 路由
