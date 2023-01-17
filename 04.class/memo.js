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
async function viewMemo() {
  const memos = await selectAllMemo("SELECT memo FROM memos");
  memos.forEach((element) => {
    console.log(element["memo"].split(/\r\n/)[0]);
  });
}

// メモの最初の行を表示して参照する
async function ref() {
  const prompt = new Enquirer.Select({
    message: "Choose a note you want to see",
    choices: loadAllMemo(),
    result(memo) {
      return memo;
    }
  });

  prompt
    .run()
    .then((answer) =>
      console.log(
        prompt.choices.find((element) => element.name === answer).value
      )
    )
    .catch(console.error);
}

async function loadAllMemo() {
  const rows = await selectAllMemo("SELECT rowid AS id, memo FROM memos");

  var lines = [];
  rows.forEach((element) => {
    lines.push({
      name: element["id"],
      message: element["memo"].split(/\r\n/)[0],
      value: element["memo"]
    });
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

async function deleteMemo() {
  const prompt = new Enquirer.Select({
    message: "Choose a note you want to delete",
    choices: loadAllMemo(),
    result(memo) {
      const db = new sqlite3.Database("./memo.sqlite3");
      db.run("DELETE FROM memos WHERE rowid = (?) ", memo);
      db.close();
    }
  });

  prompt
    .run()
    .then((answer) => console.log(answer))
    .catch(console.error);
}

viewMemo();
ref();
// deleteMemo();
