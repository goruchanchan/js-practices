#!/usr/bin/env node
const argv = process.argv.slice(2);
const today = new Date();
const year = argv["y"] != undefined ? argv["y"] : today.getFullYear();
const month = argv["m"] != undefined ? argv["m"] : today.getMonth() + 1;

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

const last_month_end_day = new Date(year, month - 1, 0).getDay();
if (last_month_end_day != 6) {
  process.stdout.write("".padStart((last_month_end_day + 1) * 3, " "));
}

const last_date = new Date(year, month % 12, 0).getDate(); // 12月の日数は、来年1月を入力すべきだが日数なので当年1月でよしとする
for (let i = 1; i <= last_date; i++) {
  const day = new Date(year, month - 1, i).getDay();
  let message = `${i}`.padStart(2, " ");
  message = day == 6 || i == last_date ? message + "\n" : message + " ";
  process.stdout.write(message);
}
console.log("");
