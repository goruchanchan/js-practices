import sqlite3 from "sqlite3";

class DB {
  createMemo() {
    return new Promise((resolve) => {
      this.db = new sqlite3.Database("./memo.sqlite3");
      this.db.run("CREATE TABLE IF NOT EXISTS memos (contents TEXT)", () => {
        resolve();
      });
    });
  }

  registerMemo(contents) {
    this.db.run("INSERT INTO memos VALUES (?)", contents.join("\r\n"));
  }

  selectAllMemo() {
    return new Promise((resolve) => {
      this.db.all("SELECT rowid AS id, contents FROM memos", (error, rows) => {
        if (error) {
          return console.error(error.message);
        }
        resolve(rows);
      });
    });
  }

  deleteMemo(id) {
    this.db.run("DELETE FROM memos WHERE rowid = ? ", id);
  }
}

export default DB;
