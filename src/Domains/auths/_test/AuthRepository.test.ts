import AuthRepository from "../AuthRepository";

describe("AuthRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const authRepository = new AuthRepository();

    // Action & Assert
    await expect(authRepository.addToken("")).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(authRepository.checkAvailabilityToken("")).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(authRepository.deleteToken("")).rejects.toThrowError(
      "AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
