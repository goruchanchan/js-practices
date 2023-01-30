import Enquirer from "enquirer";
import Memo from "./memo.js";

class Controller {
  constructor(input) {
    this.db = new Memo();
    this.memos = [];
    this.input = input;
  }

  async selectCommand() {
    await this.parseMemos();
    if (this.input["option"] === "l") {
      this.list();
    } else if (this.input["option"] === "r") {
      this.refference();
    } else if (this.input["option"] === "d") {
      this.delete();
    } else {
      this.regiest(this.input["contens"]);
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

export default Controller;
