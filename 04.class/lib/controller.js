import Enquirer from "enquirer";
import DB from "./db.js";

class Controller {
  constructor(input) {
    this.db = new DB();
    this.memos = [];
    this.input = input;
  }

  async run() {
    await this.db.createMemo().catch((error) => {
      console.log(error);
    });
    await this.assembleMemos().catch((error) => {
      console.log(error);
    });
    await this.selectCommand().catch((error) => {
      console.log(error);
    });
  }

  async assembleMemos() {
    const dbMemos = await this.db.selectAllMemo();
    this.memos = dbMemos.map((element) => ({
      id: element.id,
      contents: element.contents,
      title: element.contents.split(/\r\n/)[0]
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
      await this.loadMemoId("Choose a note you want to see")
        .then((id) => {
          console.log(this.selectMemo(id));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async delete() {
    if (this.memos.length > 0) {
      await this.loadMemoId("Choose a note you want to delete")
        .then((id) => {
          this.db.deleteMemo(id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async loadMemoId(message) {
    const prompt = new Enquirer.Select({
      message,
      choices: this.makeChoices()
    });

    await prompt
      .run()
      .then(() => {
        return prompt.value;
      })
      .catch((error) => {
        return error;
      });
  }

  makeChoices() {
    return this.memos.map((memo) => ({
      name: memo.id,
      message: memo.title,
      value: memo.contents
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
