/* istanbul ignore file */
import { pool } from "../src/Infrastructures/database/postgres/pool";

export const commentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "sebuah comment",
    owner = "user-123",
    threadId = "thread-123",
    isDeleted = false,
    date = "2021-08-08T07:26:21.338Z",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, content, owner, threadId, isDeleted, date],
    };

    await pool.query(query);
  },

  async findCommentById(id : string) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments");
  },
};
