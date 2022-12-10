#!/usr/bin/env node
import { isSameDay, isSaturday, lastDayOfMonth, subMonths } from "date-fns";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const today = new Date();
const year = argv["y"] != undefined ? argv["y"] : today.getFullYear();
const month = argv["m"] != undefined ? argv["m"] - 1 : today.getMonth();

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");

const target_cal = new Date(year, month);
const last_month_end_day = lastDayOfMonth(subMonths(target_cal, 1));

if (!isSaturday(last_month_end_day)) {
  process.stdout.write("".padStart((last_month_end_day.getDay() + 1) * 3, " "));
}

const last_date = lastDayOfMonth(target_cal).getDate();
for (let i = 1; i <= last_date; i++) {
  const day = new Date(year, month, i);
  let message = `${i}`.padStart(2, " ");
  message = isSameDay(day, today) ? `\x1b[47m${message}\x1b[49m` : message;
  message = isSaturday(day) || i == last_date ? message + "\n" : message + " ";
  process.stdout.write(message);
}
console.log("");
