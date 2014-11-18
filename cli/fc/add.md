## 二级命令 efc add

添加行为，添加符合命令格式的文件，只能在edp项目中使用

### Usages

    efc add <targetPath>

### Properties

    * --desc [-d] 描述性文字
    * --force [-f] 强制覆盖
    * --entry [-e] 仅针对于添加模块模式，会自动添加Entry文件

### Commands
支持以下命令形式：

#### `efc add <targetPath>`
添加完整的模块并注册路由信息，文件路径默认以`targetPath`为准，包括Action、View、Model、less与tpl，并且可以通过--entry（或 -e）来指定同时生成Entry文件
匹配模式为：<targetPath>是一个非文件地址或以`/`结尾
    
    * targetPath如果是绝对路径，则以src目录为起点，否则以当前所在目录为起点

#### `efc add <filePath>`
添加一个文件，会自动根据后缀名匹配模板
匹配模式为：<filePath>是一个文件地址

    * filePath如果是绝对路径，则以src目录为起点，否则以当前所在目录为起点
    * 后缀名为：html 当前实际是调用edp add [html] <filePath>
    * 后缀名为：js、css、less、tpl 则为efc控制的文件添加行为，无任何额外处理
    * 其他后缀名，会添加一个空文件

#### 【暂未支持】`efc add Action <targetPath>` 在指定目录下添加`Action`文件，并自动注册路由信息
#### 【暂未支持】`efc add View <targetPath>` 在指定目录下添加`View`文件，如果Action文件存在，会自动更新引用
#### 【暂未支持】`efc add Model <targetPath>` 在指定目录下添加`Model`文件，如果Action文件存在，会自动更新引用
#### 【暂未支持】`efc add Entry <targetPath>` 在指定目录下添加`Entry`文件，如果当前文件夹存在路由信息，会自动更新信息
#### `efc add actionConf <targetPath>` 添加注册路由信息文件，会自动更新上级引用，但是不会去更新目标路径下的配置信息
#### 【暂未支持】`efc add tpl <targetPath>` 在指定目录下添加`tpl`文件，会自动在View中引用
#### 【暂未支持】`efc add style <targetPath>` 在指定目录下添加`less`文件，会自动在View中引用

__注：__如果是以`'/'`结尾的`file`会被认为是一个模块而不是文件，比如`efc add a.js/`实际注册路由信息的`targetPath`为`/a.js`，生成的实际文件为`src/a.js/Action.js`、`src/a.js/Model.js`、`src/a.js/View.js`和`src/a.js/style.less`和`src/a.js/tpl.html`，如果指定-e，还会有`src/a.js/Entry.js`