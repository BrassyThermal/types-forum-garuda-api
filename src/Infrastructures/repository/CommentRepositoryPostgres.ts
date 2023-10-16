import { Pool } from "pg";
import CommentRepository from "../../Domains/comments/CommentRepository";
import AddComment from "../../Domains/comments/entities/AddComment";
import AddedComment from "../../Domains/comments/entities/AddedComment";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError";

export default class CommentRepositoryPostgres extends CommentRepository {
  _pool : Pool;
  _idGenerator : ()=>string;

  constructor(pool : Pool, idGenerator : ()=>string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment : AddComment) {
    const { content, owner, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, owner, threadId, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }
  
  async verifyCommentOwner(commentId : string, owner : string) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("tidak dapat mengakses resource ini");
    }
  }

  async checkComment(commentId : string, threadId : string) {
    const query = {
      text: "SELECT thread_id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount || result.rows[0].thread_id !== threadId) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async getCommentByThreadId(threadId : string) {
    const query = {
      text: `
        SELECT cm.id, us.username, cm.date, cm.content, cm.is_deleted
        FROM comments cm
        INNER JOIN users us ON us.id = cm.owner
        WHERE cm.thread_id = $1
        ORDER BY cm.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteCommentById(commentId : string) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }
}
