/* istanbul ignore file */
import { pool } from "../src/Infrastructures/database/postgres/pool";

export const likesTableTestHelper = {
  async addLike({
    id = "like-123",
    owner = "user-123",
    commentId = "comment-123",
    isDeleted = false,
  }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
      values: [id, owner, commentId, isDeleted],
    };

    await pool.query(query);
  },

  async findLikeById(id : string) {
    const query = {
      text: "SELECT * FROM likes WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM likes");
  },
};
