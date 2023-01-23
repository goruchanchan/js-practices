#!/usr/bin/env node
import minimist from "minimist";
import readline from "readline";
import sqlite3 from "sqlite3";
import Enquirer from "enquirer";

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

  registMemo(texts) {
    this.db.run("INSERT INTO memos VALUES (?) ", `${texts.join("\r\n")}`);
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

  closeMemo() {
    this.db.close();
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
    if (input["option"] === "l") {
      this.list();
    } else if (input["option"] === "r") {
      this.refference();
    } else if (input["option"] === "d") {
      this.delete();
    } else {
      this.regiest(input["contens"]);
    }
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
    const prompt = this.makeSelect("Choose a note you want to see");
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
    const prompt = this.makeSelect("Choose a note you want to delete");
    prompt
      .run()
      .then((answer) => this.db.deleteMemo(answer))
      .catch(console.error);
  }

  makeSelect(message) {
    return new Enquirer.Select({
      message: message,
      choices: this.memos,
      result(memo) {
        return memo;
      }
    });
  }

  regiest(texts) {
    this.db.registMemo(texts);
  }
}

let input = new Input(minimist(process.argv.slice(2)));
new Controller(input).commandSelect();
