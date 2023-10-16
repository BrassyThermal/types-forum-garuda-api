import { pool } from "../../database/postgres/pool";
import { authsTableTestHelper } from "../../../../tests_helper/authsTable";
import InvariantError from "../../../Commons/exceptions/InvariantError";
import AuthRepositoryPostgres from "../AuthRepositoryPostgres";

describe("AuthenticationRepository postgres", () => {
  afterEach(async () => {
    await authsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addToken function", () => {
    it("should add token to database", async () => {
      // Arrange
      const authRepository = new AuthRepositoryPostgres(pool);
      const token = "token";

      // Action
      await authRepository.addToken(token);

      // Assert
      const tokens = await authsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe("checkAvailabilityToken function", () => {
    it("should throw InvariantError if token not available", async () => {
      // Arrange
      const authRepository = new AuthRepositoryPostgres(pool);
      const token = "token";

      // Action & Assert
      await expect(authRepository.checkAvailabilityToken(token))
        .rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError if token available", async () => {
      // Arrange
      const authRepository = new AuthRepositoryPostgres(pool);
      const token = "token";
      await authsTableTestHelper.addToken(token);

      // Action & Assert
      await expect(authRepository.checkAvailabilityToken(token))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe("deleteToken", () => {
    it("should delete token from database", async () => {
      // Arrange
      const authRepository = new AuthRepositoryPostgres(pool);
      const token = "token";
      await authsTableTestHelper.addToken(token);

      // Action
      await authRepository.deleteToken(token);

      // Assert
      const tokens = await authsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
