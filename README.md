# prm -- Package Management Tools Registry Manager

`prm` can help you easy and fast switch between different npm registries,
now include: `npm`, `cnpm`, `taobao`, `nj(nodejitsu)`, `rednpm`, `yarn`, `npmMirror`, `edunpm`.

## Install

```sh
npm i prm-cli -g
```

## Example

```
$ prm ls
   cnpm           http://cnpmjs.org                   http://r.cnpmjs.org/
   npm            https://www.npmjs.org               https://registry.npmjs.org/
🚀 taobao         https://npmmirror.com               https://registry.npmmirror.com/
   taobao2        https://npmmirror.com               https://registry.npm.taobao.org/
   nj             https://www.nodejitsu.com           https://registry.nodejitsu.com/
   rednpm         http://npm.mirror.cqupt.edu.cn/     http://registry.mirror.cqupt.edu.cn/
   yarn           https://yarnpkg.com                 https://registry.yarnpkg.com
   npmMirror      https://skimdb.npmjs.com/           https://skimdb.npmjs.com/registry/
   edunpm         http://www.enpmjs.org               http://registry.enpmjs.org/

```

```
$ prm use taobao

  Registry has been set to: http://r.cnpmjs.org/
```

## Dev

```sh
sudo npm link
```
