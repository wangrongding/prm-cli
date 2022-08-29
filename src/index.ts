#!/usr/bin/env node --loader ts-node/esm --no-warnings

const { Command } = require("commander");
const version = require("../package.json").version;
const { onUse, onList, onAdd } = require("./main");

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
program.command("add").description("Add registries").action(onAdd);
program.parse(process.argv);
