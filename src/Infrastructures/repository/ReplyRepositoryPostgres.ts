import { Pool } from "pg";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import AddReply from "../../Domains/replies/entities/AddReply";
import AddedReply from "../../Domains/replies/entities/AddedReply";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError";

export default class ReplyRepositoryPostgres extends ReplyRepository {
  _pool : Pool;
  _idGenerator : ()=>string;

  constructor(pool : Pool, idGenerator : ()=>string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply : AddReply) {
    const { content, owner, commentId } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, owner, commentId, false],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async verifyReplyOwner(replyId : string, owner : string) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("tidak dapat mengakses resource ini");
    }
  }

  async checkReply(replyId : string, commentId : string) {
    const query = {
      text: "SELECT comment_id FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount || result.rows[0].comment_id !== commentId) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }

  async getReplyByThreadId(threadId : string) {
    const query = {
      text: `
        SELECT rp.id, us.username, rp.date, rp.content, rp.is_deleted, rp.comment_id
        FROM replies rp
        INNER JOIN comments cm ON cm.id = rp.comment_id
        INNER JOIN users us ON us.id = rp.owner
        WHERE cm.thread_id = $1
        ORDER BY cm.date ASC, rp.comment_id ASC, rp.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReplyById(replyId : string) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }
}
