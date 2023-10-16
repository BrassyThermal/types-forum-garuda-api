/* istanbul ignore file */
import { pool } from "../src/Infrastructures/database/postgres/pool";

export const threadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "sebuah thread",
    body = "sebuah body thread",
    owner = "user-123",
    date = "2021-08-08T07:26:21.338Z",
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadById(id : string) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads");
  },
};
