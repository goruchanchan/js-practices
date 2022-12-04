#!/usr/bin/env node

var argv = require("minimist")(process.argv.slice(2));
const today = new Date();

var year;
typeof argv["y"] != "boolean" && argv["y"] != undefined
  ? (year = argv["y"])
  : (year = today.getFullYear());

var month;
typeof argv["m"] != "boolean" && argv["m"] != undefined
  ? (month = argv["m"])
  : (month = today.getMonth() + 1);

console.log(year);
console.log(month);
