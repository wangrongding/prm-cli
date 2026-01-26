# PRM - Package Registry Manager

[![npm version](https://badge.fury.io/js/prm-cli.svg)](https://www.npmjs.com/package/prm-cli) [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

一个快速、简单的 npm 镜像源管理工具，帮助您轻松切换不同的 npm 镜像源，提升包安装速度。

`prm` 支持管理多种 npm 镜像源，包括：`npm`, `cnpm`, `taobao`, `nj(nodejitsu)`, `rednpm`, `yarn`, `npmMirror`, `edunpm`，同时支持添加和管理自定义镜像源。

> 📰 本项目被刊登在阮一峰老师的科技爱好者周刊第 [445](https://www.ruanyifeng.com/blog/2023/03/weekly-issue-245.html) 期。

## 📦 安装

```sh
### 使用 npm 安装
npm install prm-cli -g
### 使用 yarn 安装
yarn global add prm-cli
### 使用 pnpm 安装
pnpm add -g prm-cli
```

## 🚀 快速开始

### 查看所有镜像源

```sh
prm ls
# 或者
prm list
```

![](https://assets.fedtop.com/picbed/202208291120504.png)

### 切换镜像源

```sh
prm use taobao
```

![](https://assets.fedtop.com/picbed/202208291122544.png)

### 测试镜像源速度

```sh
# 测试所有镜像源
prm test

# 测试指定镜像源
prm test taobao
```

### 添加自定义镜像源

```sh
prm add <registry-name> <url> [home-url]
# 例如
prm add myregistry https://registry.example.com/ https://www.example.com/
```

### 删除自定义镜像源

```sh
prm del <registry-name>
# 或者
prm delete <registry-name>
prm rm <registry-name>
```

![](https://assets.fedtop.com/picbed/202208291517751.png)

## 📋 内置镜像源

| 名称      | 镜像地址                             | 主页                            |
| --------- | ------------------------------------ | ------------------------------- |
| npm       | https://registry.npmjs.org/          | https://www.npmjs.org           |
| cnpm      | http://r.cnpmjs.org/                 | http://cnpmjs.org               |
| taobao    | https://registry.npmmirror.com/      | https://npmmirror.com           |
| yarn      | https://registry.yarnpkg.com         | https://yarnpkg.com             |
| nj        | https://registry.nodejitsu.com/      | https://www.nodejitsu.com       |
| rednpm    | http://registry.mirror.cqupt.edu.cn/ | http://npm.mirror.cqupt.edu.cn/ |
| npmMirror | https://skimdb.npmjs.com/registry/   | https://skimdb.npmjs.com/       |
| edunpm    | http://registry.enpmjs.org/          | http://www.enpmjs.org           |

## 本地开发

```sh
# 克隆项目
git clone https://github.com/wangrongding/prm-cli.git
cd prm-cli

# 安装依赖
npm install

# 链接到全局
sudo npm link

# 构建
npm run build
```

---

如果这个工具对您有帮助，请给个 ⭐️ 支持一下！
