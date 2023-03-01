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
      contents: memo.contents
    }));
  }

  async selectCommand() {
    if (this.input.isOptionList()) {
      this.list();
    } else if (this.input.isOptionReference()) {
      this.reference();
    } else if (this.input.isOptionDelete()) {
      this.delete();
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
    if (this.memos.length > 0) {
      const id = await this.loadMemoId("Choose a note you want to see");
      try {
        console.log(this.selectMemo(id));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async delete() {
    if (this.memos.length > 0) {
      const id = await this.loadMemoId("Choose a note you want to delete");
      try {
        this.db.deleteMemo(id);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async loadMemoId(message) {
    const prompt = new Enquirer.Select({
      message,
      choices: this.makeChoices()
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
      message: memo.title
    }));
  }

  selectMemo(id) {
    return this.memos.find((memo) => memo.id === id).contents;
  }

  register() {
    this.db.registerMemo(this.input.contents);
  }
}

export default Controller;
