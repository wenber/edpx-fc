edpx-fc
=======

edpx扩展fc脚手架

# 安装方式

## npm link

```javascript
git clone git://github.com/fcfe/edpx-fc.git
cd edpx-fc
sudo npm link .
```

## npm install

```javascript
sudo npm install -g edpx-fc
```

# 使用

## 二级命令 edp fc init

在当前目录下初始化符合命令格式的文件

### Usages

    edp fc init command 
    edp fc init mvc [--prefix=prefixName] [--with-ef=true]

### Commands

第三级命令：

+ mvc - 初始化符合er的mvc文件

### 三级命令 edp fc init mvc

Options：

    --prefix - 指定文件名称前缀
    --template - 指定模板文件的target名称
    --desc - 指定模块的描述信息，会在文件的头部注释中体现
    --with-ef - 标记需要使用扩展自EF的类而不是ER

默认初始化文件列表：

+ Action.js
+ Model.js
+ View.js
+ tpl.tpl
+ style.less

如果使用了前缀`Index`，则为：

+ IndexAction.js
+ IndexModel.js
+ IndexView.js
+ index.tpl
+ index.less