const npm = require("npm");
const chalk = require("chalk");
const request = require("request");
const registryList = require("./registryList").default;

function exit(err: Error) {
  console.error("error: " + err);
  process.exit(1);
}

function getRegistry(name: string) {
  return registryList.find((item: any) => item.name === name);
}
export function onTest(name: string) {
  const registry = getRegistry(name);
  // 需要测试的 registry 列表
  const registries = registry ? [registry] : registryList;
  // 遍历 registryList 测试每个 registry 的响应时间
  registries.forEach((item: any) => {
    const start = Date.now();
    request(
      {
        url: item.registry,
        timeout: 1000,
      },
      (err: Error, res: any) => {
        if (err) {
          console.log(chalk.red(`💩${item.name} ${err}`));
        } else {
          console.log(
            chalk.green(
              `🎉${item.name} ${res.statusCode} ${Date.now() - start}ms`
            )
          );
        }
      }
    );
  });
}

// 切换源
export function onUse(name: string) {
  const registry = registryList.filter((item: any) => item.name === name)[0];

  if (registry === void 0) {
    console.error(`${name} is not found`);
    return;
  } else {
    // 更改npm的源
    npm.load((err: Error) => {
      if (err) return exit(err);
      npm.commands.config(
        ["set", "registry", registry.registry],
        (err: Error, data: any) => {
          if (err) return exit(err);
          const newR = npm.config.get("registry");
          console.log(
            "\n",
            chalk.green(
              `🎉🎉🎉 NPM Registry has been set to: ${registry.name} (${newR})`
            ),
            "\n\n\n",
            chalk.blue("https://github.com/wangrongding"),
            "\n"
          );
        }
      );
    });
  }
}

// 获取列表
export function onList() {
  npm.load((err: Error, conf: any) => {
    if (err) return exit(err);
    // 获取当前源
    const current = npm.config.get("registry");
    registryList.forEach((item: any) => {
      const str = `${(item.name + " ").padEnd(14, " ")} ${item.home.padEnd(
        35,
        " "
      )} ${item.registry}`;
      console.log(
        item.registry === current ? chalk.blue(`🚀 ${str}`) : `   ${str}`
      );
    });
  });
}

// 添加源
export function onAdd() {
  console.log(chalk.blue("onAdd"));
  console.log(chalk.green("wip..."));
}

exports.default = {
  onUse,
  onList,
  onAdd,
};
