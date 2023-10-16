import type UserRegistered from "../../Domains/users/entities/UserRegistered";

export default class AuthTokenManager {
  async createRefreshToken(payload : {
    username : string;
    id ?: string | void;
  }) : Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async createAccessToken(payload : {
    username : string;
    id ?: string | void;
  }) : Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async verifyRefreshToken(token : string) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async decodePayload(refreshToken : string) : Promise<UserRegistered> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}
