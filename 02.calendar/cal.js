#!/usr/bin/env node

var argv = require("minimist")(process.argv.slice(2));
const today = new Date();

var year =
  typeof argv["y"] != "boolean" && argv["y"] != undefined
    ? argv["y"]
    : today.getFullYear();

var month =
  typeof argv["m"] != "boolean" && argv["m"] != undefined
    ? argv["m"] - 1
    : today.getMonth();

let last_month_end_day = new Date(year, month, 0);

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");
if (last_month_end_day.getDay() != 6) {
  process.stdout.write("".padEnd((last_month_end_day.getDay() + 1) * 3, " "));
}

let last_day = new Date(year, (month + 1) % 12, 0).getDate();
for (let i = 1; i <= last_day; i++) {
  if (new Date(year, month, i).getDay() == 6) {
    console.log(`${i}`.padStart(2, " "));
  } else {
    i == last_day
      ? console.log(`${i}`.padStart(2, " ") + " ")
      : process.stdout.write(`${i}`.padStart(2, " ") + " ");
  }
}
console.log("");
