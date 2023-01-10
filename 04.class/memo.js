#!/usr/bin/env node
import minimist from "minimist";
import readline from "readline";
import sqlite3 from "sqlite3";

function regiestMemo(texts) {
  const db = new sqlite3.Database("./memo.sqlite3");
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS MEMOS (memo TEXT)");
    db.run("INSERT INTO memos VALUES (?) ", `${texts.join("\r\n")}`);
  });
  db.close();
}

const argv = minimist(process.argv.slice(2));
//console.log(argv);

// メモをDBへ登録
const text = readline.createInterface({
  input: process.stdin
});
var texts = [];
text.on("line", (text) => {
  texts.push(text);
});
text.on("close", () => {
  // regiestMemo(texts);
});

// メモの最初の行のみの一覧を表示
const db = new sqlite3.Database("./memo.sqlite3");
db.each("SELECT rowid AS id, memo FROM memos", (err, row) => {
  var memo = row.memo;
  var line = memo.split(/\r\n/);
  console.log(line[0]);
});
db.close();
