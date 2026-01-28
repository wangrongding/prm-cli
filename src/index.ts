#!/usr/bin/env node

const { Command } = require("commander");
const version = require("../package.json").version;
const { onUse, onList, onAdd, onTest, onDelete } = require("./main");

const program = new Command();

program
  .name("prm")
  .description("CLI to switching the registry of the package management tools")
  .version(version, "-v, --version, -V");

program
  .command("list")
  .alias("ls")
  .description("List all the registries")
  .action(onList);

program
  .command("use <registry>")
  .description("Change registry to registry")
  .action(onUse);

program
  .command("test [registry]")
  .description("Show response time for specific or all registries")
  .action(onTest);

program
  .command("add [name] [registry] [home]")
  .description("Add a custom registry")
  .action((name: string, registry: string, home: string) => {
    onAdd(name, registry, home);
  });

program
  .command("delete <name>")
  .alias("del")
  .alias("rm")
  .description("Delete a custom registry")
  .action(onDelete);

program.parse(process.argv);
