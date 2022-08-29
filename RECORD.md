# 一个 ts 运行环境的 cli 工具

## 初始化仓库

```sh
npm init -y
```

## 安装核心依赖包

- ts-node
- tslib
- @types/node
- typescript

```sh
npm i -D ts-node tslib @types/node typescript
# or
yarn add -D ts-node tslib @types/node typescript
# or
pnpm add -D ts-node tslib @types/node typescript
```

## 初始化 ts 配置文件

```sh
npx tsc --init
```

我的配置文件如下：

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext", // 编译后的代码类型
    "removeComments": true, // 删除注释
    "useDefineForClassFields": true, // 类的字段使用 define 来定义
    "module": "esnext", // 模块类型
    "moduleResolution": "node", // 模块解析器
    "strict": true, // 严格模式
    "jsx": "preserve", // jsx 编译方式
    "importHelpers": true, // 引入帮助器
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "sourceMap": true, // 源码映射
    "resolveJsonModule": true, // 解析 json 文件
    "isolatedModules": true, // 单文件模块
    "esModuleInterop": true, // es6 模块化
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"], // 包含的库
    "allowJs": true, // 允许使用 js
    "noImplicitAny": true, // 不允许隐式any
    "skipLibCheck": true, // 跳过库检查
    "forceConsistentCasingInFileNames": true, // 文件名大小写一致
    "baseUrl": ".", // 基础路径
    "declaration": true, // 是否生成声明文件
    "declarationDir": "types", // 声明文件输出路径
    "outDir": "./bin", // 输出目录
    // 路径映射
    "paths": {
      "@/*": ["src/*"]
    }
  },
  // 包含的文件
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  // 排除的文件
  "exclude": ["node_modules", "dist"]
}
```

由于
在 tsconfig 另外新建一个 "ts-node"字段，然后单独存放这个 module 和 types 字段。这样可以不影响项目的 compilerOptions

```json
// tsconfig.json
{
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS",
      "esModuleInterop": true,
      "types": ["node"]
    }
  },
  "compilerOptions": {
    "target": "ES5", // 编译后的代码类型
    "removeComments": true, // 删除注释
    "useDefineForClassFields": true, // 类的字段使用 define 来定义
    "module": "esnext", // 模块类型
    "moduleResolution": "node", // 模块解析器
    "strict": true, // 严格模式
    "jsx": "preserve", // jsx 编译方式
    "importHelpers": true, // 引入帮助器
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "sourceMap": true, // 源码映射
    "resolveJsonModule": true, // 解析 json 文件
    "isolatedModules": true, // 单文件模块
    "esModuleInterop": true, // es6 模块化
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"], // 包含的库
    "allowJs": true, // 允许使用 js
    "noImplicitAny": true, // 不允许隐式any
    "skipLibCheck": true, // 跳过库检查
    "forceConsistentCasingInFileNames": true, // 文件名大小写一致
    "baseUrl": ".", // 基础路径
    "declaration": true, // 是否生成声明文件
    "declarationDir": "types", // 声明文件输出路径
    "outDir": "./bin", // 输出目录
    // 路径映射
    "paths": {
      "@/*": ["src/*"]
    }
  },
  // 包含的文件
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  // 排除的文件
  "exclude": ["node_modules", "dist"]
}
```
