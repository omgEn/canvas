### 1、创建vue project

```
npm install -g @vue/cli (已安装可忽略)
npm create project-name
```

### 2、修改项目目录结构

![image-20210605174507108](C:\Users\102398\AppData\Roaming\Typora\typora-user-images\image-20210605174507108.png)

```
ui
 -examples (用于测试封装的组件类似之前的src目录)
 -lib （最终生成的npm包）
 -node_modules
 -packages （要封装的组件）
 -public （公共资源目录）
 -theme （用于公共样式和样式变量的存放目录）
 .browserslistrc （默认配置）
 .eslintrc.js （默认配置）
 .npmignore (npm 包发布时只需将lib和package.json，readme.md（可选）进行上传)
 .gitigonre （默认配置）
 babel.config.js （babel默认配置）
 package-lock.json
 package.json
 readme.md
 vue.config.js
```

### 3、package目录介绍

#### package/index.js 默认入口

```javascript
// 导入颜色选择器组件
import './rem'
import Button from './button'
import Dialog from './dialog'
import Input from './input'
import Switch from './switch'
import './fonts/font.scss'
// 存储组件列表
const components = [
  Button,
  Dialog,
  Input,
  Switch
]
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
  if (install.installed) return;
  // 遍历注册全局组件
  components.forEach(component => {
    console.log('全局引入')
    Vue.component(component.name, component)
    Vue.use(component)
  })
}
// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 默认暴露，方便全局引入
export default {
  Button,
  Dialog,
  Input,
  Switch,
  install
}

// 可以按需引入
export {
  Button,
  Dialog,
  Input,
  Switch,
  install
}

```

#### dialog/src/dialog.vue（eg）

````vue
<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div class="cx-dialog__wrapper" v-show="visible" @click.self="handleClose">
      <div class="cx-dialog" :style="{width: width, marginTop: top}">
        <div class="cx-dialog__header">
          <slot name="title">
            <span class="cx-dialog__title">{{title}}</span>
          </slot>
          <button class="cx-dialog__headerbtn" @click="handleClose">
            <i class="el-icon-close"></i>
          </button>
        </div>
        <div class="cx-dialog__body">
          <!-- 默认插槽 -->
          <slot name="content"></slot>
        </div>
        <div class="cx-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CxDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      istemplete: true
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false)
      if(!this.istemplete){
        this.visible = false
      }
    },
    afterEnter () {
      this.$emit('opened')
    },
    afterLeave () {
      this.$emit('closed')
    },
    show (option) {
      this.istemplete = false
      this.visible = true
      this.$slots.content = option.msg
    },
    close () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.cx-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
  background-color: rgba(0,0,0, .5);

  .cx-dialog {
    position: relative;
    margin: 15vh auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    width: 30%;

    &__header {
      padding: 20px 20px 10px;
      .cx-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
      .cx-dialog__headerbtn {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        .el-icon-close {
          color: #909399;
        }
      }
    }

    &__body {
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    &__footer {
      padding: 10px 20px 20px;
      text-align: right;
      box-sizing: border-box;
      .cx-button:first-child {
        margin-right: 20px;
      }
    }
  }
}

.dialog-fade-enter-active {
  animation: dialog-fade-in .4s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out .4s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>

````

#### dialog/index.js (eg)

```javascript
// 导入组件，组件必须声明 name
import Vue from 'vue'
import CxDialog from './src/dialog.vue'

// 让组件可以js调用
const DialogController = Vue.extend(CxDialog)
const instance = new DialogController().$mount(document.createElement('div'))
const dialog = (option) => {
  document.body.appendChild(instance.$el)
  instance.show(option)
}
dialog.close = instance.close

// 为组件提供 install 安装方法，供按需引入
CxDialog.install = function (Vue) {
  Vue.component(CxDialog.name, CxDialog)
  Vue.$cxdialog = Vue.prototype.$cxdialog = dialog
}

export default CxDialog
```

### 4、package.json配置

![](C:\Users\102398\AppData\Roaming\Typora\typora-user-images\image-20210607092033623.png)

eg:

```json
{
  "name": "cxy-ui", //项目名
  "version": "0.1.7", //版本号，自己定义
  "description": "Depends on vue-cli3, refer to a UI component library encapsulated by element-ui",
  "private": false,
  "author": {
    "name": "sunyangyang"
  },
  "license": "ISC",
  "main": "lib/cxy-ui.umd.min.js",
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "lib": "vue-cli-service build --target lib --dest lib packages/index.js"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.2.2",
    "vue-template-compiler": "^2.6.11",
    "sass": "^1.23.7",
    "sass-loader": "^8.0.0"
  }
}
```

### 5. vue.config.js

```javascript
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js', // 发布之前测试，可将入口配置成examples/main.js
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, 'packages')).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config.resolve.alias // 添加别名
    .set('@theme', resolve('theme'))
   }
}
```

### 6、添加.npmignore文件

```
# 忽略目录
examples/
packages/
public/
 
# 忽略指定文件
.browserslistrc
.eslintrc.js
.eslintrc.js
vue.config.js
babel.config.js
*.map
```

### 7、npm 发布

首先去[npm官网](https://www.npmjs.com/)注册一个账号记得去查看邮箱邮件来认证邮箱，要不然会上传会不成功。

然后在项目中打开命令行工具`npm adduser` or `npm login`输入你注册的用户名密码和邮箱，可以使用`npm whoami`查看登录状态。

在发布之前, 我们修改一下项目的名称(注意不要和npm已有项目名称冲突，可以先去npm搜索一下), 推荐使用 `@你注册npm的用户名/项目名称` 的命名方式。

接下来我们就可以发布我们的 UI 组件库了, 在发布之前我们再编译一次, 让*build*出的文件为我们最新的修改:

```
npm run lib
```

我们使用下面的命令发布我们的项目:

```
npm publish --access public
```

### 8、直接将npm包上传到github或gitLib，不直接发布到npm

如果你不想将自己的库上传到npm, 你也可以上传到gitHub或者gitLab上内部的私有库使用,只需要将如下目录上传

```
-lib
package.json
readme.md
```

### 9、在项目中引入组件库使用

#### 安装对应的组件库

```
1、 若想直接用npm上发布的文件则直接
  npm install cxy-ui(你的包名)
2、 若是用的gitlib或者github上的私有包则需要先在package.json添加依赖，如
  "cxy-ui": "https://github.com/xxx/cxy-ui-lib.git",
  再进行 npm install cxy-ui(你的包名)
```

#### 在项目的main.js中进行引入

![image-20210607095032340](C:\Users\102398\AppData\Roaming\Typora\typora-user-images\image-20210607095032340.png)

```
import Vue from 'vue'
import App from './App.vue'

// 引入自定义组件库
import 'cxy-ui/lib/cxy-ui.css'
//全局引入
// import Cxui from 'cxy-ui'
// Vue.use(Cxui)

// 按需引入
import {
  Button,
  Dialog,
  Input,
  Switch
} from 'cxy-ui'
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Switch)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

#### 页面中使用

```
<template>
  <div id="app">
    <!-- button测试 -->
    <div class="test-item">
      <cx-button type="success" @click="handleClick">我是button1</cx-button>
      <cx-button type="primaly">我是button2</cx-button>
    </div>
    
    <!-- dialog测试 -->
    <!-- <cx-dialog :visible="isDialogShow" title="提示" >
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
      <template v-slot:footer>
        <cx-button @click="isDialogShow = false">取 消</cx-button>
        <cx-button type="primary" @click="isDialogShow = false">确 定</cx-button>
      </template>
    </cx-dialog> -->

    <!-- input测试 -->
    <div class="test-item">
      <cx-input type="password" v-model="inputContent" :clearable="true"></cx-input>
      <div class="input-content">输入的内容：{{inputContent}}</div>
    </div>

    <!-- switch测试 -->
    <div class="test-item">
      <cx-switch :value="isChecked" @input="handleSwitchChange"></cx-switch>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      isDialogShow: false,
      inputContent: '',
      isChecked: false,
    }
  },
  methods: {
    handleClick(){
      // this.isDialogShow = true
      // js调用
       this.$cxdialog({
        msg: '提示的具体内容',
      })
    },
    handleSwitchChange(value){
      this.isChecked = value
    }
  }
}
</script>

<style>
#app{
  color: #000;
  display: flex;
  flex-direction: column;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.test-item{
  margin-top: 40px;
}
.input-content{
  margin-top: 10px;
}
</style>
```

### 10、组件实现多主题（Sass变量实现）

此方案涉及Sass的map遍历、函数定义、map存取、混合器等相关知识，具体API详参官网https://www.sass.hk/docs/。

大概的思路就是给html根标签设置一个data-theme属性，通过js切换data-theme的属性值，sass根据此属性来判断使用对应主题变量。

具体实现步骤，参考[Vue+Sass实现动态换肤](https://blog.csdn.net/u598975767/article/details/103819991?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.control)

