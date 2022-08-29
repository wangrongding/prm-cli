#!/usr/bin/env node

// hook into ts-node so we can run typescript on the fly
require("ts-node").register({
  project: `${__dirname}/../tsconfig.json`,
  files: true,
  cache: true,
  transpileOnly: true,
});

// run the CLI with the current process arguments
require("../src/index");
