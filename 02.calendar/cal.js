#!/usr/bin/env node
import { isSameDay, isSaturday, lastDayOfMonth, startOfMonth } from "date-fns";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const today = new Date();
const year = argv["y"] !== undefined ? argv["y"] : today.getFullYear();
const month = argv["m"] !== undefined ? argv["m"] - 1 : today.getMonth();

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");

const target_cal = new Date(year, month);
const first_day = startOfMonth(target_cal).getDay();
process.stdout.write("".padStart(first_day * 3, " "));

const end_date = lastDayOfMonth(target_cal).getDate();
for (let i = 1; i <= end_date; i++) {
  const day = new Date(year, month, i);
  let message = `${i}`.padStart(2, " ");
  message = isSameDay(day, today) ? `\x1b[47m${message}\x1b[49m` : message;
  message += isSaturday(day) || i === end_date ? "\n" : " ";
  process.stdout.write(message);
}
console.log("");
