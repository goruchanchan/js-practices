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
console.log(argv);

const text = readline.createInterface({
  input: process.stdin
});

var texts = [];
text.on("line", (text) => {
  texts.push(text);
});

text.on("close", () => {
  //標準入力のストリームが終了すると呼ばれる
  // regiestMemo(texts);
});

const db = new sqlite3.Database("./memo.sqlite3");
db.each("SELECT rowid AS id, memo FROM memos", (err, row) => {
  console.log(row.id + ": " + row.memo);
});
db.close();
