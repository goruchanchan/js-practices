import readline from "readline";
import minimist from "minimist";

class Input {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.contents = [];
    if (!this.option.l && !this.option.r && !this.option.d) {
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
