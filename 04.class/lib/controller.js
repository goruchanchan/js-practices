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
    if (this.input.option.l) {
      this.list();
    } else if (this.input.option.r) {
      if (this.memos.length > 0) this.reference();
    } else if (this.input.option.d) {
      if (this.memos.length > 0) this.delete();
    } else {
      this.register();
    }
  }

  async assembleMemos() {
    const dbMemos = await this.db.selectAllMemo();
    if (dbMemos === undefined || dbMemos.length === 0) return;
    dbMemos.forEach((element) => {
      this.memos.push({
        id: element.id,
        contents: element.memo,
        title: element.memo.split(/\r\n/)[0]
      });
    });
  }

  makeChoices() {
    const choices = [];
    for (let memo of this.memos) {
      const choice = {};
      choice.name = memo.id;
      choice.message = memo.title;
      choice.contents = memo.contents;
      choices.push(choice);
    }
    return choices;
  }

  list() {
    this.memos.forEach((memo) => {
      console.log(memo.title);
    });
  }

  async reference() {
    const id = await this.loadMemoId("Choose a note you want to see");
    console.log(this.selectMemo(id));
  }

  async delete() {
    const id = await this.loadMemoId("Choose a note you want to delete");
    this.db.deleteMemo(id);
  }

  async loadMemoId(message) {
    const prompt = new Enquirer.Select({
      message,
      choices: this.makeChoices()
    });

    await prompt.run().catch(console.error);
    return prompt.value;
  }

  register() {
    this.db.registerMemo(this.input.contents);
  }

  selectMemo(id) {
    for (let element of this.memos) {
      if (element.id === id) {
        return element.contents;
      }
    }
  }
}

export default Controller;
