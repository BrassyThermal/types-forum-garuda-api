import AuthRepository from "../../../Domains/auths/AuthRepository";
import AuthTokenManager from "../../security/AuthTokenManager";
import RefreshAuthUseCase from "../RefreshAuthUseCase";

describe("RefreshAuthenticationUseCase", () => {
  it("should throw error if use case payload not contain refresh token", async () => {
    // Arrange
    const useCasePayload = {};
    const refreshAuthUseCase = new RefreshAuthUseCase({} as any);

    // Action & Assert
    await expect(refreshAuthUseCase.execute(useCasePayload as any)).rejects.toThrow(
      "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  it("should throw error if refresh token not string", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1,
    };
    const refreshAuthUseCase = new RefreshAuthUseCase({} as any);

    // Action & Assert
    await expect(refreshAuthUseCase.execute(useCasePayload as any)).rejects.toThrow(
      "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the refresh authentication action correctly", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: "some_refresh_token",
    };

    /** creating dependency of use case */
    const mockAuthRepository = new AuthRepository();
    const mockAuthTokenManager = new AuthTokenManager();
    
    /** mocking needed function */
    mockAuthRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: "dicoding", id: "user-123" }));
    mockAuthTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve("some_new_access_token"));

    /** creating use case instance */
    const refreshAuthUseCase = new RefreshAuthUseCase({
      authRepository: mockAuthRepository,
      authTokenManager: mockAuthTokenManager,
    });

    // Action
    const accessToken = await refreshAuthUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthTokenManager.verifyRefreshToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthRepository.checkAvailabilityToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthTokenManager.createAccessToken).toHaveBeenCalledWith(
      { username: "dicoding", id: "user-123" }
    );
    expect(accessToken).toEqual("some_new_access_token");
  });
});
