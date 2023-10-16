import { Pool } from "pg";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import AddThread from "../../Domains/threads/entities/AddThread";
import AddedThread from "../../Domains/threads/entities/AddedThread";
import NotFoundError from "../../Commons/exceptions/NotFoundError";

export default class ThreadRepositoryPostgres extends ThreadRepository {
  _pool : Pool;
  _idGenerator : ()=>string;

  constructor(pool : Pool, idGenerator : ()=>string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread : AddThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async checkThread(id : string) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThreadById(id : string) {
    const query = {
      text: `
        SELECT td.id, td.title, td.body, td.date, us.username
        FROM threads td
        INNER JOIN users us ON td.owner = us.id
        WHERE td.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }
}
