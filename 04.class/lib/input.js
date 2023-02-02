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
    const contents = readline.createInterface({
      input: process.stdin
    });
    contents.on("line", (line) => {
      this.contents.push(line);
    });
  }
}

export default Input;
