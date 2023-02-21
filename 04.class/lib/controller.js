import Enquirer from "enquirer";
import Memo from "./memo.js";

class Controller {
  constructor(input) {
    this.db = new Memo();
    this.memos = [];
    this.input = input;
  }

  async run() {
    await this.db.createMemo();
    await this.assembleMemos();
    await this.selectCommand();
  }

  async assembleMemos() {
    const dbMemos = await this.db.selectAllMemo();
    dbMemos.forEach((element) => {
      this.memos.push({
        id: element.id,
        contents: element.contents,
        title: element.contents.split(/\r\n/)[0]
      });
    });
  }

  async selectCommand() {
    if (this.input.isOptionList()) {
      this.list();
    } else if (this.input.isOptionReference()) {
      if (this.memos.length > 0) this.reference();
    } else if (this.input.isOptionDelete()) {
      if (this.memos.length > 0) this.delete();
    } else {
      this.register();
    }
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

  selectMemo(id) {
    for (let element of this.memos) {
      if (element.id === id) {
        return element.contents;
      }
    }
  }

  register() {
    this.db.registerMemo(this.input.contents);
  }
}

export default Controller;
