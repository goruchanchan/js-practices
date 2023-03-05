import Enquirer from "enquirer";
import DB from "./db.js";

class Controller {
  constructor(input) {
    this.db = new DB();
    this.memos = [];
    this.input = input;
  }

  async run() {
    try {
      await this.db.createMemo();
      await this.assembleMemos();
      await this.selectCommand();
    } catch (error) {
      console.error(error);
    }
  }

  async assembleMemos() {
    const dbMemos = await this.db.selectAllMemo();
    this.memos = dbMemos.map((memo) => ({
      id: memo.id,
      title: memo.contents.split(/\n/)[0],
      contents: memo.contents,
    }));
  }

  async selectCommand() {
    if (this.input.isOptionList()) {
      this.list();
    } else if (this.input.isOptionReference()) {
      await this.reference();
    } else if (this.input.isOptionDelete()) {
      await this.delete();
    } else {
      await this.register();
    }
  }

  list() {
    this.memos.forEach((memo) => {
      console.log(memo.title);
    });
  }

  async reference() {
    if (this.memos.length > 0) {
      const id = await this.loadMemoId("Choose a note you want to see");
      console.log(this.selectMemo(id));
    }
  }

  async delete() {
    if (this.memos.length > 0) {
      const id = await this.loadMemoId("Choose a note you want to delete");
      this.db.deleteMemo(id);
    }
  }

  async loadMemoId(message) {
    const prompt = new Enquirer.Select({
      message,
      choices: this.makeChoices(),
    });

    try {
      await prompt.run();
      return prompt.value;
    } catch (error) {
      console.error(error);
    }
  }

  makeChoices() {
    return this.memos.map((memo) => ({
      name: memo.id,
      message: memo.title,
    }));
  }

  selectMemo(id) {
    return this.memos.find((memo) => memo.id === id)?.contents;
  }

  async register() {
    await this.db.registerMemo(this.input.contents);
  }
}

export default Controller;
