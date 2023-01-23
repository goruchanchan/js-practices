import readline from "readline";

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

export default Input;
