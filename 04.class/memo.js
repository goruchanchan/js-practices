#!/usr/bin/env node
import minimist from "minimist";
import readline from "readline";
import sqlite3 from "sqlite3";
// import prompt from "enquirer";
import Enquirer from "enquirer";

function regiestMemo(texts) {
  const db = new sqlite3.Database("./memo.sqlite3");
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS MEMOS (memo TEXT)");
    db.run("INSERT INTO memos VALUES (?) ", `${texts.join("\r\n")}`);
  });
  db.close();
}

// const argv = minimist(process.argv.slice(2));
// //console.log(argv);

// // メモをDBへ登録
// const text = readline.createInterface({
//   input: process.stdin
// });
// var texts = [];
// text.on("line", (text) => {
//   texts.push(text);
// });
// text.on("close", () => {
//   // regiestMemo(texts);
// });

// // メモの最初の行のみの一覧を表示
// const db = new sqlite3.Database("./memo.sqlite3");
// db.each("SELECT rowid AS id, memo FROM memos", (err, row) => {
//   var memo = row.memo;
//   console.log(memo);
//   var line = memo.split(/\r\n/);
//   // console.log(line[0]);
// });
// db.close();

// メモの最初の行を参照
async function ref(lines) {
  const prompt = new Enquirer.Select({
    name: "memo",
    message: "Choose a note you want to see",
    choices: lines
  });

  prompt
    .run()
    .then((answer) => console.log("Answer:", answer))
    .catch(console.error);
}

var lines = [];
const db = new sqlite3.Database("./memo.sqlite3");
db.each("SELECT rowid AS id, memo FROM memos", (err, row) => {
  lines.push(row.memo.split(/\r\n/)[0]);
  ref(lines);
});
db.close();
