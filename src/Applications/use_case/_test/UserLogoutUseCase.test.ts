import AuthRepository from "../../../Domains/auths/AuthRepository";
import UserLogoutUseCase from "../UserLogoutUseCase";

describe("UserLogoutUseCase", () => {
  it("should throw error if use case payload not contain refresh token", async () => {
    // Arrange
    const useCasePayload = {};
    const userLogoutUseCase = new UserLogoutUseCase({} as any);

    // Action & Assert
    await expect(userLogoutUseCase.execute(useCasePayload as any)).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  it("should throw error if refresh token not string", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    const userLogoutUseCase = new UserLogoutUseCase({} as any);

    // Action & Assert
    await expect(userLogoutUseCase.execute(useCasePayload as any)).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should orchestrating the delete authentication action correctly", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: "refreshToken",
    };

    /** creating dependency of use case */
    const mockAuthRepository = new AuthRepository();

    /** mocking needed function */
    mockAuthRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthRepository.deleteToken = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const userLogoutUseCase = new UserLogoutUseCase({
      authRepository: mockAuthRepository,
    });

    // Action
    await userLogoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthRepository.checkAvailabilityToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
