#!/usr/bin/env node

var argv = require("minimist")(process.argv.slice(2));
const today = new Date();

var year =
  typeof argv["y"] != "boolean" && argv["y"] != undefined
    ? argv["y"]
    : today.getFullYear();

var month =
  typeof argv["m"] != "boolean" && argv["m"] != undefined
    ? argv["m"]
    : today.getMonth() + 1;

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

let last_month_end_day = new Date(year, month - 1, 0).getDay();
if (last_month_end_day != 6) {
  process.stdout.write("".padEnd((last_month_end_day + 1) * 3, " "));
}

let last_date = new Date(year, month % 12, 0).getDate();
for (let i = 1; i <= last_date; i++) {
  if (new Date(year, month - 1, i).getDay() == 6) {
    console.log(`${i}`.padStart(2, " "));
  } else {
    i == last_date
      ? console.log(`${i}`.padStart(2, " ") + "" + " ")
      : process.stdout.write(`${i}`.padStart(2, " ") + " ");
  }
}
console.log("");
