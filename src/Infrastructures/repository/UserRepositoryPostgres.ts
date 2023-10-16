import { Pool } from "pg";
import UserRepository from "../../Domains/users/UserRepository";
import UserRegister from "../../Domains/users/entities/UserRegister";
import UserRegistered from "../../Domains/users/entities/UserRegistered";
import InvariantError from "../../Commons/exceptions/InvariantError";

export default class UserRepositoryPostgres extends UserRepository {
  _pool : Pool;
  _idGenerator : ()=>string;

  constructor(pool : Pool, idGenerator : ()=>string) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  
  async addUser(registerUser : UserRegister) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new UserRegistered({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username : string) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("username tidak tersedia");
    }
  }

  async getPasswordByUsername(username : string) {
    const query = {
      text: "SELECT password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("username tidak ditemukan");
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username : string) {
    const query = {
      text: "SELECT id FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("user tidak ditemukan");
    }

    const { id } = result.rows[0];

    return id;
  }
}
