#!/usr/bin/env node
import minimist from "minimist";
import readline from "readline";
import sqlite3 from "sqlite3";
// import prompt from "enquirer";
import Enquirer from "enquirer";
import Form from "enquirer";

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
async function ref() {
  const prompt = new Enquirer.Select({
    name: "content",
    message: "Choose a note you want to see",
    choices: loadAllMemo()
  });

  prompt
    .run()
    .then((answer) => console.log(answer.content))
    .catch(console.error);
}

async function loadAllMemo() {
  const rows = await selectAllMemo("SELECT * FROM memos");
  var lines = [];
  rows.forEach((element) => {
    lines.push(element["memo"].split(/\r\n/)[0]);
  });
  return lines;
}

function selectAllMemo(sql) {
  return new Promise((resolve) => {
    const db = new sqlite3.Database("./memo.sqlite3");
    db.all(sql, (error, rows) => {
      resolve(rows);
    });
    db.close();
  });
}

// ref();

const memos = [
  { name: "メモ1", value: "メモ１\r\n2行目\r\n3行目" },
  { name: "メモ2", value: "メモ２\r\n2行目\r\n3行目" },
  { name: "メモ3", value: "メモ３\r\n2行目\r\n3行目" }
];

async function testMemo() {
  const prompt = new Enquirer.Select({
    name: "value",
    message: "Choose a note you want to see",
    choices: memos,
    result(memo) {
      return memo;
    }
  });

  prompt
    .run()
    .then((answer) =>
      console.log(memos.find((element) => element.name === answer).value)
    )
    .catch(console.error);
}

testMemo();

// const foo = memos.find((element) => element.name === 2);
// console.log(foo);
