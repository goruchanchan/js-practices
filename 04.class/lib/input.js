import readline from "readline";

class Input {
  constructor(option) {
    this.option = null;
    this.contents = [];
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

  readConsole() {
    const text = readline.createInterface({
      input: process.stdin
    });
    text.on("line", (text) => {
      this.contents.push(text);
    });
  }
}

export default Input;
