/* istanbul ignore file */

// External Agency
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import Jwt from "@hapi/jwt";
import { pool } from "../database/postgres/pool";

// Importing Repository
import UserRepository from "../../Domains/users/UserRepository";
import AuthRepository from "../../Domains/auths/AuthRepository";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";

// Importing Service Repository
import UserRepositoryPostgres from "../repository/UserRepositoryPostgres";
import AuthRepositoryPostgres from "../repository/AuthRepositoryPostgres";
import ThreadRepositoryPostgres from "../repository/ThreadRepositoryPostgres";
import CommentRepositoryPostgres from "../repository/CommentRepositoryPostgres";
import ReplyRepositoryPostgres from "../repository/ReplyRepositoryPostgres";

// Importing Security 
import PasswordHash from "../../Applications/security/PasswordHash";
import BcryptPasswordHash from "../security/BcryptPasswordHash";
import AuthTokenManager from "../../Applications/security/AuthTokenManager";
import JwtTokenManager from "../security/JwtTokenManager";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ServiceRegister = [
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },

  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },

  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },

  {
    key: AuthTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },

  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },

  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },

  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
];
