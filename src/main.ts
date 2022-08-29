const npm = require("npm");
const chalk = require("chalk");
const registryList = require("./registryList").default;

function exit(err: Error) {
  console.error("error: " + err);
  process.exit(1);
}

// 切换源
export function onUse(name: string) {
  const registry = registryList.filter((item: any) => item.name === name)[0];

  if (registry === void 0) {
    console.error(`${name} is not found`);
    return;
  } else {
    console.log("🚀🚀🚀", registry);
    // 更改npm的源
    npm.load(function (err: Error) {
      if (err) return exit(err);
      npm.commands.config(
        ["set", "registry", registry.registry],
        function (err: Error, data: any) {
          if (err) return exit(err);
          const newR = npm.config.get("registry");
          console.log(
            chalk.green(`🎉🎉🎉 NPM Registry has been set to: `, newR)
          );
        }
      );
    });
  }
}

// 获取列表
export function onList() {
  npm.load(function (err: Error, conf: any) {
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
