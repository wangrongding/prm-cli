# PRM -- package manager's registry manager

`prm` can help you easy and fast switch between different npm registries,
now include: `npm`, `cnpm`, `taobao`, `nj(nodejitsu)`, `rednpm`, `yarn`, `npmMirror`, `edunpm`.  

> 本项目被刊登在阮一峰老师的科技爱好者周刊第 [445](https://www.ruanyifeng.com/blog/2023/03/weekly-issue-245.html) 期。

## Install

```sh
npm i prm-cli -g
```

## Example

```sh
# List all registries
prm ls
```

![](https://assets.fedtop.com/picbed/202208291120504.png)

```sh
# Select a registry that you need to switch
prm use taobao
```

![](https://assets.fedtop.com/picbed/202208291122544.png)

```sh
# Show response time for specific or all registries
prm test
# or
prm test [registry]
```

![](https://assets.fedtop.com/picbed/202208291517751.png)

## Dev

```sh
sudo npm link
```
