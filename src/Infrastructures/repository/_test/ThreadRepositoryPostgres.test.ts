import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import AddThread from "../../../Domains/threads/entities/AddThread";
import AddedThread from "../../../Domains/threads/entities/AddedThread";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import ThreadRepositoryPostgres from "../ThreadRepositoryPostgres";

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist create thread and return created thread correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "sebuah thread",
        body: "sebuah body thread",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      await usersTableTestHelper.addUser({ id: "user-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await threadsTableTestHelper.findThreadById(
        createdThread.id
      );
      expect(threads).toBeDefined();
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual("thread-123");
      expect(threads[0].title).toEqual(addThread.title);
      expect(threads[0].owner).toEqual(addThread.owner);
      expect(createdThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "sebuah thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("checkThread function", () => {
    it("should throw NotFoundError when thread does not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        threadRepositoryPostgres.checkThread("")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when thread exists", async () => {
      // Arrange
      const owner = "user-123";
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action and Assert
      return expect(
        threadRepositoryPostgres.checkThread(threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread is not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        threadRepositoryPostgres.getThreadById("")
      ).rejects.toThrow(NotFoundError);
    });

    it("should get thread by thread ID correctly", async () => {
      // Arrange
      const threadData = {
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        owner: "user-123",
        date: "2021-08-08T07:26:21.338Z",
      };
      const userData = {
        id: "user-123",
        username: "the-username",
      };
      await usersTableTestHelper.addUser(userData);
      await threadsTableTestHelper.addThread(threadData);
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(
        threadData.id
      );

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadData.id);
      expect(thread.title).toEqual(threadData.title);
      expect(thread.body).toEqual(threadData.body);
      expect(thread.date).toEqual(new Date(threadData.date));
      expect(thread.username).toEqual(userData.username);
    });
  });
});
