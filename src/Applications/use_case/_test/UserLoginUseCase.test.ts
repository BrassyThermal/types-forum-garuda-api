import UserRepository from "../../../Domains/users/UserRepository";
import AuthRepository from "../../../Domains/auths/AuthRepository";
import AuthTokenManager from "../../security/AuthTokenManager";
import PasswordHash from "../../security/PasswordHash";
import NewAuth from "../../../Domains/auths/entities/NewAuth";
import UserLoginUseCase from "../UserLoginUseCase";

describe("GetAuthenticationUseCase", () => {
  it("should orchestrating the get authentication action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
    };
    const mockedAuthentication = new NewAuth({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });
    const mockUserRepository = new UserRepository();
    const mockAuthRepository = new AuthRepository();
    const mockAuthTokenManager = new AuthTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));
    mockPasswordHash.comparePassword = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.accessToken)
      );
    mockAuthTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.refreshToken)
      );
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve("user-123"));
    mockAuthRepository.addToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const userLoginUseCase = new UserLoginUseCase({
      userRepository: mockUserRepository,
      authRepository: mockAuthRepository,
      authTokenManager: mockAuthTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await userLoginUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: "access_token",
        refreshToken: "refresh_token",
      })
    );
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith("dicoding");
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      "secret",
      "encrypted_password"
    );
    expect(mockUserRepository.getIdByUsername).toBeCalledWith("dicoding");
    expect(mockAuthTokenManager.createAccessToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });
    expect(mockAuthTokenManager.createRefreshToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });
    expect(mockAuthRepository.addToken).toBeCalledWith(
      mockedAuthentication.refreshToken
    );
  });
});
