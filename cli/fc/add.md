## 二级命令 efc add

添加行为，添加符合命令格式的文件

### Usages

    efc add <path>

### Commands
支持以下命令形式：

* `efc add <path>` 添加完整的模块并注册路由信息，文件路径默认以`path`为准，包括Action、View、Model、less与tpl，并且可以通过--entry（或 -e）来指定同时生成Entry文件
* `efc add <file>` 添加文件，匹配模式为 <file>是一个文件地址
    - 后缀名为：js、html 当前实际是调用edp add [js|html] <file>
    - 后缀名为：css、less、tpl 则为efc控制的文件添加行为，无任何额外处理
    - 其他后缀名，会添加一个空文件
* 【暂未支持】`efc add action <path>` 注册路由信息并在`src`目录下添加`Action`文件
* 【暂未支持】`efc add view <path>` 在`src`目录下添加`View`文件
* 【暂未支持】`efc add model <path>` 在`src`目录下添加`Model`文件
* 【暂未支持】`efc add tpl <path>` 在`src`目录下添加`tpl`文件，会自动在View中引用
* 【暂未支持】`efc add less <path>` 在`src`目录下添加`less`文件，会自动在View中引用

__注：__如果是以`'/'`结尾的`file`会被认为是一个模块而不是文件，比如`efc add a.js/`实际注册路由信息的`path`为`/a.js`，生成的实际文件为`src/a.js/Action.js`、`src/a.js/Model.js`、`src/a.js/View.js`和`src/a.js/style.less`和`src/a.js/tpl.html`，如果指定-e，还会有`src/a.js/Entry.js`
