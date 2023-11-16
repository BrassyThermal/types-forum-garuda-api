import InvariantError from "../../../Commons/exceptions/InvariantError";
import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import UserRegister from "../../../Domains/users/entities/UserRegister";
import UserRegistered from "../../../Domains/users/entities/UserRegistered";
import UserRepositoryPostgres from "../UserRepositoryPostgres";

describe("UserRepositoryPostgres", () => {
  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addUser function", () => {
    it("should persist register user and return registered user correctly", async () => {
      // Arrange
      const userRegister = new UserRegister({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(userRegister);

      // Assert
      const users = await usersTableTestHelper.findUserById("user-123");
      expect(users).toHaveLength(1);
    });

    it("should return registered user correctly", async () => {
      // Arrange
      const userRegister = new UserRegister({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const userRegistered = await userRepositoryPostgres.addUser(userRegister);

      // Assert
      expect(userRegistered).toStrictEqual(
        new UserRegistered({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        })
      );
    });
  });

  describe("verifyAvailableUsername function", () => {
    it("should throw InvariantError when username not available", async () => {
      // Arrange
      await usersTableTestHelper.addUser({ username: "dicoding" }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError when username available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe("getPasswordByUsername", () => {
    it("should throw InvariantError when user not found", () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        userRepositoryPostgres.getPasswordByUsername("dicoding")
      ).rejects.toThrow(InvariantError);
    });

    it("should return username password when user is found", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );
      await usersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername(
        "dicoding"
      );
      expect(password).toBe("secret_password");
    });
  });

  describe("getIdByUsername", () => {
    it("should throw InvariantError when user not found", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByUsername("dicoding")
      ).rejects.toThrow(InvariantError);
    });

    it("should return user id correctly", async () => {
      // Arrange
      await usersTableTestHelper.addUser({
        id: "user-321",
        username: "dicoding",
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {} as any
      );

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername("dicoding");

      // Assert
      expect(userId).toEqual("user-321");
    });
  });
});
