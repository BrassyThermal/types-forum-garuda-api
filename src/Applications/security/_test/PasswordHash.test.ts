import PasswordHash from "../PasswordHash";

describe("EncryptionHelper interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const encryptionHelper = new PasswordHash();

    // Action & Assert
    await expect(encryptionHelper.hash("dummy_password")).rejects.toThrow(
      "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
    );
    await expect(encryptionHelper.comparePassword("plain", "encrypted")).rejects.toThrow(
      "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
    );
  });
});
