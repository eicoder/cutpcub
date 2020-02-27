# cutpcub:baby:

> 简单的切图工程化项目，目的是工程化管理代码，提高开发速度跟积累

## 安装

```shell
npm install cutpcub -g
```

### 初始化

```shell
cutpcub init <工程名称>
```

## 使用

### 新建项目

```shell
cutpcub new <project> <page>
```

### 新建页面

```shell
cutcub add <page>
```

### 开发

```shell
npm run dev --env.m=<project>
```

### 打包

```shell
npm run build <project>
```



## 功能

1. 预先将styles里的sass的变量跟mixins等引入可以直接使用
2. 将图片放入`src/projects/<project>/sprites`的文件夹里会自动生成雪碧图，使用`icon-图片名称`的类名就能使用
3. 将自定义图标库放在`src/styles/icon`打包时候将独立打包
4. 打包会自动删除无用的css（如果有动态使用类，将被误删，可以通过`build/config.js`修改`purifyCss`关闭功能）

## TODO

:white_large_square:一个项目支持多张雪碧图

:white_large_square:html组件

:white_large_square:代码规范/格式化