#!/usr/bin/env node
import minimist from "minimist";
import readline from "readline";
import sqlite3 from "sqlite3";
import Enquirer from "enquirer";

// function regiestMemo(texts) {
//   const db = new sqlite3.Database("./memo.sqlite3");
//   db.serialize(() => {
//     db.run("CREATE TABLE IF NOT EXISTS MEMOS (memo TEXT)");
//     db.run("INSERT INTO memos VALUES (?) ", `${texts.join("\r\n")}`);
//     console.log("registed memo :");
//     console.log(`${texts.join("\r\n")}`);
//   });
//   db.close();
// }

// // メモの最初の行のみの一覧を表示
// async function viewMemo() {
//   const memos = await selectAllMemo("SELECT memo FROM memos");
//   memos.forEach((element) => {
//     console.log(element["memo"].split(/\r\n/)[0]);
//   });
// }

// // メモの最初の行を表示して参照する
// async function ref() {
//   const prompt = new Enquirer.Select({
//     message: "Choose a note you want to see",
//     choices: loadAllMemo(),
//     result(memo) {
//       return memo;
//     }
//   });

//   prompt
//     .run()
//     .then((answer) =>
//       console.log(
//         prompt.choices.find((element) => element.name === answer).value
//       )
//     )
//     .catch(console.error);
// }

// async function deleteMemo() {
//   const prompt = new Enquirer.Select({
//     message: "Choose a note you want to delete",
//     choices: loadAllMemo(),
//     result(memo) {
//       const db = new sqlite3.Database("./memo.sqlite3");
//       db.run("DELETE FROM memos WHERE rowid = (?) ", memo);
//       db.close();
//     }
//   });

//   prompt
//     .run()
//     .then((answer) => console.log(answer))
//     .catch(console.error);
// }

// async function loadAllMemo() {
//   const rows = await selectAllMemo("SELECT rowid AS id, memo FROM memos");

//   var lines = [];
//   rows.forEach((element) => {
//     lines.push({
//       name: element["id"],
//       message: element["memo"].split(/\r\n/)[0],
//       value: element["memo"]
//     });
//   });
//   console.log(lines);
//   return lines;
// }

// function selectAllMemo(sql) {
//   return new Promise((resolve) => {
//     const db = new sqlite3.Database("./memo.sqlite3");
//     db.all(sql, (error, rows) => {
//       resolve(rows);
//     });
//     db.close();
//   });
// }

// function readConsole() {
//   const text = readline.createInterface({
//     input: process.stdin
//   });
//   var texts = [];
//   text.on("line", (text) => {
//     texts.push(text);
//   });
//   text.on("close", () => {
//     console.log(texts);
//     return texts;
//   });
// }

class Input {
  constructor(option) {
    this.option = null;
    this.contens = [];
    if (option["r"]) {
      this.option = "r";
    } else if (option["l"]) {
      this.option = "l";
    } else if (option["d"]) {
      this.option = "d";
    } else {
      this.readConsole();
    }
  }

  async readConsole() {
    const text = await readline.createInterface({
      input: process.stdin
    });
    text.on("line", (text) => {
      this.contens.push(text);
    });
  }
}

class Memo {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
    this.db.run("CREATE TABLE IF NOT EXISTS MEMOS (memo TEXT)");
  }

  async selectAllMemo() {
    return new Promise((resolve) => {
      this.db.all("SELECT rowid AS id, memo FROM memos", (error, rows) => {
        resolve(rows);
      });
    });
  }

  deleteMemo(memo) {
    this.db.run("DELETE FROM memos WHERE rowid = (?) ", memo);
  }
}

class Controller {
  constructor(input) {
    this.db = new Memo();
    this.memos = [];
    this.input = input;
  }

  async commandSelect() {
    await this.parseMemos();
    this.list();
    this.refference();
    // this.delete();
  }

  async parseMemos() {
    const db_memos = await this.db.selectAllMemo();

    db_memos.forEach((element) => {
      this.memos.push({
        name: element["id"],
        message: element["memo"].split(/\r\n/)[0],
        value: element["memo"]
      });
    });
  }

  list() {
    this.memos.forEach((element) => {
      console.log(element["message"].split(/\r\n/)[0]);
    });
  }

  refference() {
    const prompt = new Enquirer.Select({
      message: "Choose a note you want to see",
      choices: this.memos,
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

  delete() {
    const prompt = new Enquirer.Select({
      message: "Choose a note you want to delete",
      choices: this.memos,
      result(memo) {
        return memo;
      }
    });

    prompt
      .run()
      .then((answer) => this.db.deleteMemo(answer))
      .catch(console.error);
  }
}

let input = new Input(minimist(process.argv.slice(2)));
new Controller(input).commandSelect();
