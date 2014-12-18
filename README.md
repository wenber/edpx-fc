edpx-fc
=======

edpx-fc（efc）是基于edp的插件机制开发的凤巢脚手架工具，当前针对的服务主要为：

    1) 凤巢版项目初始化处理
    2) 模块/文件添加，并自动处理引用
    3) webserver服务【暂未提供】
    4) mock服务【暂未提供】
    5) 自动化测试【暂未提供】
    6) CR处理【暂未提供】

# 安装方式

## edp install

```javascript
edp fc
```

## npm link

```javascript
git clone git://github.com/fcfe/edpx-fc.git
cd edpx-fc
npm link .
```

## npm install

```javascript
npm install -g edpx-fc
```

# 使用

基于edp的插件模式，已经集成了—help指令说明

efc是edp fc的缩写，在安装完成之后即可直接使用此缩写命令

### 二级命令

    * efc add：添加行为，添加符合命令格式的文件
    * efc init：初始化一个符合凤巢特性的项目