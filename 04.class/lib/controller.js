import Enquirer from "enquirer";
import Memo from "./memo.js";

class Controller {
  constructor(input) {
    this.db = new Memo();
    this.memos = [];
    this.input = input;
  }

  async selectCommand() {
    await this.assembleMemos();
    if (this.input.option === "l") {
      this.list();
    } else if (this.input.option === "r") {
      this.reference();
    } else if (this.input.option === "d") {
      this.delete();
    } else {
      this.register(this.input.contents);
    }
  }

  async assembleMemos() {
    const dbMemos = await this.db.selectAllMemo();

    dbMemos.forEach((element) => {
      this.memos.push({
        name: element.id,
        message: element.memo.split(/\r\n/)[0],
        contents: element.memo
      });
    });
  }

  list() {
    this.memos.forEach((element) => {
      console.log(element.message);
    });
  }

  async reference() {
    const id = await this.makeSelect("Choose a note you want to see");
    console.log(this.selectMemo(id));
  }

  async delete() {
    const id = await this.makeSelect("Choose a note you want to delete");
    this.db.deleteMemo(id);
  }

  async makeSelect(message) {
    const prompt = new Enquirer.Select({
      message,
      choices: this.memos,
      result(memo) {
        return memo;
      }
    });

    await prompt.run();
    return prompt.value;
  }

  register(texts) {
    this.db.registerMemo(texts);
  }

  selectMemo(id) {
    for (let element of this.memos) {
      if (element.name === id) {
        return element.contents;
      }
    }
  }
}

export default Controller;
