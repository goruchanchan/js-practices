import sqlite3 from "sqlite3";

class DB {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  createMemo() {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS memos (contents TEXT)",
        (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        }
      );
    });
  }

  registerMemo(contents) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO memos VALUES (?)",
        contents.join("\n"),
        (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        }
      );
    });
  }

  selectAllMemo() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT rowid AS id, contents FROM memos", (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }

  deleteMemo(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memos WHERE rowid = ? ", id, (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}

export default DB;
