import UserRepository from "../../Domains/users/UserRepository";
import AuthRepository from "../../Domains/auths/AuthRepository";
import AuthTokenManager from "../security/AuthTokenManager";
import PasswordHash from "../security/PasswordHash";
import UserLogin, { type UserLoginPayload } from "../../Domains/users/entities/UserLogin";
import NewAuth from "../../Domains/auths/entities/NewAuth";

interface UserLoginRepository {
  userRepository : UserRepository;
  authRepository : AuthRepository;
  authTokenManager : AuthTokenManager;
  passwordHash : PasswordHash;
}

export default class UserLoginUseCase {
  _userRepository : UserRepository;
  _authRepository : AuthRepository;
  _authTokenManager : AuthTokenManager;
  _passwordHash : PasswordHash;

  constructor({
    userRepository,
    authRepository,
    authTokenManager,
    passwordHash,
  } : UserLoginRepository) {
    this._userRepository = userRepository;
    this._authRepository = authRepository;
    this._authTokenManager = authTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload : UserLoginPayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(
      username
    );

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authTokenManager.createAccessToken({
      username,
      id,
    });
    const refreshToken = await this._authTokenManager.createRefreshToken({
      username,
      id,
    });

    const newAuth = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this._authRepository.addToken(newAuth.refreshToken);

    return newAuth;
  }
}
