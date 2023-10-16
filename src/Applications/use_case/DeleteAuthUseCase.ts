import AuthRepository from "../../Domains/auths/AuthRepository";

interface DeleteAuthRepository {
  authRepository : AuthRepository;
}

export default class DeleteAuthUseCase {
  _authRepository : AuthRepository;
  
  constructor({ authRepository } : DeleteAuthRepository) {
    this._authRepository = authRepository;
  }

  async execute(useCasePayload : {refreshToken : string}) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authRepository.checkAvailabilityToken(refreshToken);
    await this._authRepository.deleteToken(refreshToken);
  }

  private _validatePayload(payload : {refreshToken : string}) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error("DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN");
    }

    if (typeof refreshToken !== "string") {
      throw new Error("DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
