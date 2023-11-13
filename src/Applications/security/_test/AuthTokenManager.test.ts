import AuthTokenManager from "../AuthTokenManager";

describe("AuthTokenManager interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const tokenManager = new AuthTokenManager();

    // Action & Assert
    await expect(tokenManager.createAccessToken("" as any)).rejects.toThrow(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );
    await expect(tokenManager.createRefreshToken("" as any)).rejects.toThrow(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );
    await expect(tokenManager.verifyRefreshToken("")).rejects.toThrow(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );
    await expect(tokenManager.decodePayload("")).rejects.toThrow(
      "AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED"
    );
  });
});
