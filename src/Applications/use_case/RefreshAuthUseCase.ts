import AuthRepository from "../../Domains/auths/AuthRepository";
import AuthTokenManager from "../security/AuthTokenManager";

interface RefreshAuthRepository {
  authRepository : AuthRepository;
  authTokenManager : AuthTokenManager;
}

export default class RefreshAuthUseCase {
  _authRepository : AuthRepository;
  _authTokenManager : AuthTokenManager;

  constructor({ authRepository, authTokenManager } : RefreshAuthRepository) {
    this._authRepository = authRepository;
    this._authTokenManager = authTokenManager;
  }

  async execute(useCasePayload : { refreshToken : string }) {
    this._verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authTokenManager.verifyRefreshToken(refreshToken);
    await this._authRepository.checkAvailabilityToken(refreshToken);

    const { username, id } = await this._authTokenManager.decodePayload(
      refreshToken
    );

    return this._authTokenManager.createAccessToken({ username, id });
  }

  private _verifyPayload(payload : { refreshToken : string }) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof refreshToken !== "string") {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}
