#!/usr/bin/env node

var argv = require("minimist")(process.argv.slice(2));

var year = argv["y"];
var month = argv["m"];

console.log(year);
console.log(month);
