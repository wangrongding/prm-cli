const chalk = require('chalk');
const request = require('request');
const registryList = require('./registryList').default;
// const spawn = require('child_process').spawn;
const spawn = require('cross-spawn'); // 兼容windows

function getRegistry(name: string) {
  return registryList.find((item: any) => item.name === name);
}
export function onTest(name: string) {
  const registry = getRegistry(name);
  // 需要测试的 registry 列表
  const registries = registry ? [registry] : registryList;
  // 遍历 registryList 测试每个 registry 的响应时间
  registries.forEach((item: any) => {
    const { registry, home, name } = item;
    const start = Date.now();
    request(
      {
        url: registry,
        timeout: 5000,
      },
      (error: Error, response: any, body: any) => {
        const end = Date.now();
        const success = !error && response.statusCode === 200;
        const time = end - start;
        const color = success ? 'green' : 'red';
        const symbol = success ? '🟢' : '💩';

        console.log(
          chalk[color](
            `${symbol} ${name.padEnd(12, ' ')} (${(time + 'ms').padEnd(6, ' ')}) - ${error || response.statusCode}`
          )
        );
      }
    );
  });
}

// 切换源
export function onUse(name: string) {
  const registry = registryList.filter((item: any) => item.name === name)[0];

  if (registry === void 0) {
    return console.error(chalk.red(`${name} does not exist!`));
  } else {
    // 更改npm的源
    const npm = spawn('npm', ['config', 'set', 'registry', registry.registry, '--no-workspaces']);
    // 失败
    npm.stderr.on('data', (data: Buffer) => {
      console.error(chalk.red(data.toString()));
    });
    // 成功
    npm.on('close', (code: number) => {
      if (code === 0) {
        const npm = spawn('npm', ['config', 'get', 'registry', '--no-workspaces']);
        npm.stdout.on('data', (data: string) => {
          const current = data.toString().trim();
          console.log(chalk.green(`\n🎉🎉🎉 Succeed!`), chalk.blue(`\n------ ${registry.name} (${current}) \n`));
        });
      } else {
        console.log(chalk.red('npm config set 命令执行失败'));
      }
    });
  }
}

// 获取列表
export function onList() {
  const npm = spawn('npm', ['config', 'get', 'registry', '--no-workspaces']);
  npm.stdout.on('data', (data: string) => {
    console.log('\n');
    const current = data.toString().trim();
    // 遍历源列表，如果当前源在源列表中，则高亮
    registryList.forEach((item: any) => {
      const str = `${(item.name + ' ').padEnd(14, ' ')} ${item.home.padEnd(32, ' ')} ${item.registry}`;
      console.log(item.registry === current ? chalk.blue(`🚀 ${str}`) : `   ${str}`);
    });
    // 如果当前源不在源列表中，则显示当前源
    if (!registryList.some((item: any) => item.registry === current)) {
      const str = `${('custom' + ' ').padEnd(14, ' ')} ${current}`;
      console.log(chalk.blue(`🚀 ${str} (in your .npmrc)`));
    }
    console.log('\n');
  });
}

// 添加源
export function onAdd() {
  console.log(chalk.green('\n wip... \n'));
}

exports.default = {
  onUse,
  onList,
  onAdd,
};
