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

  isOptionList() {
    return this.option.l;
  }

  isOptionReference() {
    return this.option.r;
  }

  isOptionDelete() {
    return this.option.d;
  }

  readConsole() {
    const consoleInput = readline.createInterface({
      input: process.stdin,
    });
    consoleInput.on("line", (line) => {
      this.contents.push(line);
    });
  }
}

export default Input;
