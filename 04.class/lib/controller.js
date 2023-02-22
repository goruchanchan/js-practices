import Enquirer from "enquirer";
import DB from "./db.js";

class Controller {
  constructor(input) {
    this.db = new DB();
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
      choices: this.makeChoices()
    });

    // await prompt.run().catch(console.error);
    await prompt.run();
    return prompt.value;
  }

  makeChoices() {
    return this.memos.map((memo) => ({
      name: memo.id,
      message: memo.title,
      contents: memo.contents
    }));
  }

  selectMemo(id) {
    return this.memos.find((contents) => contents.id === id).contents;
  }

  register() {
    this.db.registerMemo(this.input.contents);
  }
}

export default Controller;
