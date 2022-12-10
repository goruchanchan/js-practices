#!/usr/bin/env node
const argvParse = require("minimist");
const isSameDay = require("date-fns/isSameDay");
const isSaturday = require("date-fns/isSaturday");
const lastDayOfMonth = require("date-fns/lastDayOfMonth");

const argv = argvParse(process.argv.slice(2));
const today = new Date();
const year = argv["y"] != undefined ? argv["y"] : today.getFullYear();
const month = argv["m"] != undefined ? argv["m"] : today.getMonth() + 1;

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

const last_month_end_day = new Date(year, month - 1, 0).getDay();
if (last_month_end_day != 6) {
  process.stdout.write("".padStart((last_month_end_day + 1) * 3, " "));
}

const last_date = lastDayOfMonth(new Date(year, month - 1)).getDate();
for (let i = 1; i <= last_date; i++) {
  const day = new Date(year, month - 1, i);
  let message = `${i}`.padStart(2, " ");
  message = isSameDay(day, today) ? `\x1b[47m${message}\x1b[49m` : message;
  message = isSaturday(day) || i == last_date ? message + "\n" : message + " ";
  process.stdout.write(message);
}
console.log("");
