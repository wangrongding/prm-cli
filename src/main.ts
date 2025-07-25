const chalk = require('chalk');
const request = require('request');
const fs = require('fs');
const path = require('path');
const registryList = require('./registryList').default;
// const spawn = require('child_process').spawn;
const spawn = require('cross-spawn'); // 兼容windows

// 类型定义
interface RegistryItem {
  name: string;
  registry: string;
  home: string;
}

// 获取配置文件路径
function getConfigPath(): string {
  const userHome = require('os').homedir();
  return path.join(userHome, '.prm-config.json');
}

// 加载用户自定义配置
function loadUserConfig(): RegistryItem[] {
  const configPath = getConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.customRegistries || [];
    }
  } catch (error) {
    console.warn(chalk.yellow('读取用户配置失败，将使用默认配置'));
  }
  return [];
}

// 保存用户自定义配置
function saveUserConfig(customRegistries: RegistryItem[]): void {
  const configPath = getConfigPath();
  const config = { customRegistries };
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(chalk.red('保存配置失败:'), error);
  }
}

// 获取完整的注册源列表（默认 + 自定义）
function getAllRegistries(): RegistryItem[] {
  const userRegistries = loadUserConfig();
  return [...registryList, ...userRegistries];
}

function getRegistry(name: string): RegistryItem | undefined {
  const allRegistries = getAllRegistries();
  return allRegistries.find((item: RegistryItem) => item.name === name);
}
export function onTest(name: string) {
  const registry = getRegistry(name);
  // 需要测试的 registry 列表
  const registries = registry ? [registry] : getAllRegistries();
  // 遍历 registryList 测试每个 registry 的响应时间
  registries.forEach((item: RegistryItem) => {
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
  const registry = getRegistry(name);

  if (registry === undefined) {
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
    const allRegistries = getAllRegistries();
    
    // 显示默认源
    console.log(chalk.gray('📦 默认镜像源列表:'));
    registryList.forEach((item: RegistryItem) => {
      const str = `${(item.name + ' ').padEnd(14, ' ')} ${item.home.padEnd(32, ' ')} ${item.registry}`;
      console.log(item.registry === current ? chalk.blue(`🚀 ${str}`) : `   ${str}`);
    });
    
    // 显示自定义源
    const userRegistries = loadUserConfig();
    if (userRegistries.length > 0) {
      console.log(chalk.gray('\n🔧 自定义镜像源列表:'));
      userRegistries.forEach((item: RegistryItem) => {
        const str = `${(item.name + ' ').padEnd(14, ' ')} ${item.home.padEnd(32, ' ')} ${item.registry}`;
        console.log(item.registry === current ? chalk.blue(`🚀 ${str}`) : `   ${str}`);
      });
    }
    
    // 如果当前源不在源列表中，则显示当前源
    if (!allRegistries.some((item: RegistryItem) => item.registry === current)) {
      console.log(chalk.gray('\n💡 当前源:'));
      const str = `${('custom' + ' ').padEnd(14, ' ')} ${current}`;
      console.log(chalk.blue(`🚀 ${str} (in your .npmrc)`));
    }
    console.log('\n');
  });
}

// 添加源
export function onAdd(name?: string, registry?: string, home?: string) {
  const readline = require('readline');
  
  if (name && registry) {
    // 直接添加模式（命令行参数）
    addRegistry(name, registry, home || '');
    return;
  }
  
  // 交互式添加模式
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(chalk.blue('\n📝 添加自定义镜像源\n'));

  rl.question(chalk.green('请输入源名称: '), (inputName: string) => {
    if (!inputName.trim()) {
      console.log(chalk.red('❌ 源名称不能为空'));
      rl.close();
      return;
    }

    // 检查是否已存在
    const existingRegistry = getRegistry(inputName.trim());
    if (existingRegistry) {
      console.log(chalk.red(`❌ 源名称 "${inputName.trim()}" 已存在`));
      rl.close();
      return;
    }

    rl.question(chalk.green('请输入镜像源地址: '), (inputRegistry: string) => {
      if (!inputRegistry.trim()) {
        console.log(chalk.red('❌ 镜像源地址不能为空'));
        rl.close();
        return;
      }

      // 验证 URL 格式
      try {
        new URL(inputRegistry.trim());
      } catch (error) {
        console.log(chalk.red('❌ 镜像源地址格式不正确'));
        rl.close();
        return;
      }

      rl.question(chalk.green('请输入主页地址 (可选): '), (inputHome: string) => {
        addRegistry(inputName.trim(), inputRegistry.trim(), inputHome.trim() || inputRegistry.trim());
        rl.close();
      });
    });
  });
}

// 添加注册源的核心逻辑
function addRegistry(name: string, registry: string, home: string): void {
  const userRegistries = loadUserConfig();
  
  // 检查是否已存在
  const existingRegistry = getRegistry(name);
  if (existingRegistry) {
    console.log(chalk.red(`❌ 源名称 "${name}" 已存在`));
    return;
  }

  // 检查 registry URL 是否已存在
  const allRegistries = getAllRegistries();
  if (allRegistries.some(item => item.registry === registry)) {
    console.log(chalk.red(`❌ 镜像源地址 "${registry}" 已存在`));
    return;
  }

  const newRegistry: RegistryItem = {
    name,
    registry: registry.endsWith('/') ? registry : registry + '/',
    home: home || registry
  };

  userRegistries.push(newRegistry);
  saveUserConfig(userRegistries);

  console.log(chalk.green('\n✅ 镜像源添加成功!'));
  console.log(chalk.blue(`   名称: ${name}`));
  console.log(chalk.blue(`   地址: ${newRegistry.registry}`));
  console.log(chalk.blue(`   主页: ${newRegistry.home}`));
  console.log(chalk.gray(`\n💡 使用 'prm use ${name}' 切换到新添加的源\n`));
}

// 删除自定义源
export function onDelete(name: string) {
  if (!name) {
    console.log(chalk.red('❌ 请指定要删除的源名称'));
    return;
  }

  const userRegistries = loadUserConfig();
  const index = userRegistries.findIndex(item => item.name === name);
  
  if (index === -1) {
    // 检查是否是默认源
    const isDefaultRegistry = registryList.some((item: RegistryItem) => item.name === name);
    if (isDefaultRegistry) {
      console.log(chalk.red(`❌ 不能删除默认源 "${name}"`));
    } else {
      console.log(chalk.red(`❌ 源 "${name}" 不存在`));
    }
    return;
  }

  const deletedRegistry = userRegistries[index];
  userRegistries.splice(index, 1);
  saveUserConfig(userRegistries);

  console.log(chalk.green(`✅ 成功删除源 "${deletedRegistry.name}"`));
  console.log(chalk.gray(`   地址: ${deletedRegistry.registry}\n`));
}

exports.default = {
  onUse,
  onList,
  onAdd,
  onTest,
  onDelete,
};
