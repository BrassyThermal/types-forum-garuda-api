import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { repliesTableTestHelper } from "../../../../tests_helper/repliesTable";
import AddReply from "../../../Domains/replies/entities/AddReply";
import AddedReply from "../../../Domains/replies/entities/AddedReply";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError";
import ReplyRepositoryPostgres from "../ReplyRepositoryPostgres";

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
    await repliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist post comment and return posted reply correctly", async () => {
      // Arrange
      const owner = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });
      const addReply = new AddReply({
        content: "sebuah balasan",
        owner,
        threadId,
        commentId,
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await commentRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await repliesTableTestHelper.findReplyById(addedReply.id);
      expect(replies).toBeDefined();
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual("reply-123");
      expect(replies[0].content).toEqual("sebuah balasan");
      expect(replies[0].owner).toEqual("user-123");
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: addReply.content,
          owner: addReply.owner,
        })
      );
    });
  });

  describe("checkReply function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const replyId = "reply-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: "comment-123" });
      await repliesTableTestHelper.addReply({ id: replyId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        replyRepositoryPostgres.checkReply(replyId, "")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const commentId = "comment-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      await repliesTableTestHelper.addReply({ id: "reply-123" });
      const commentRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.checkReply("", commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when reply found", async () => {
      // Arrange
      const replyId = "reply-123";
      const commentId = "comment-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      await repliesTableTestHelper.addReply({ id: replyId });
      const commentRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.checkReply(replyId, commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw UnauthorizedError when provided userId is not the comment owner", async () => {
      // Arrange
      const replyId = "reply-123";
      const userId = "user-123";
      await usersTableTestHelper.addUser({ id: userId });
      await threadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await commentsTableTestHelper.addComment({
        id: "comment-123",
        owner: userId,
      });
      await repliesTableTestHelper.addReply({ id: replyId, owner: userId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, "")
      ).rejects.toThrow(AuthorizationError);
    });

    it("should verify the reply owner correctly", async () => {
      // Arrange
      const replyId = "reply-123";
      const userId = "user-123";
      await usersTableTestHelper.addUser({ id: userId });
      await threadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await commentsTableTestHelper.addComment({
        id: "comment-123",
        owner: userId,
      });
      await repliesTableTestHelper.addReply({ id: replyId, owner: userId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, userId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getReplyByThreadId function", () => {
    it("should show empty array if no reply found by thread ID", async () => {
      // Arrange
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: threadId });
      await commentsTableTestHelper.addComment({ id: "comment-123", threadId });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const replies = await replyRepositoryPostgres.getReplyByThreadId(
        threadId
      );

      // Assert
      expect(replies).toBeDefined();
      expect(replies).toHaveLength(0);
    });
  });

  it("should get replies by thread ID correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const commentId1 = "comment-123";
    const commentId2 = "comment-321";
    await usersTableTestHelper.addUser({ id: "user-123" });
    await usersTableTestHelper.addUser({
      id: "user-321",
      username: "john doe",
    });
    await threadsTableTestHelper.addThread({ id: threadId });
    await commentsTableTestHelper.addComment({
      id: commentId1,
      threadId,
      date: "2023-07-17T13:57:11.225Z",
    });
    await commentsTableTestHelper.addComment({
      id: commentId2,
      threadId,
      date: "2023-07-18T13:57:11.225Z",
    });

    await repliesTableTestHelper.addReply({
      id: "reply-123",
      owner: "user-123",
      commentId: commentId1,
      date: "2023-07-19T13:57:11.225Z",
      isDeleted: true,
    });
    await repliesTableTestHelper.addReply({
      id: "reply-321",
      owner: "user-321",
      commentId: commentId2,
      date: "2023-07-19T13:56:01.301Z",
    });
    await repliesTableTestHelper.addReply({
      id: "reply-456",
      owner: "user-321",
      commentId: commentId2,
      date: "2023-07-19T13:59:01.301Z",
    });
    const fakeIdGenerator = () => "123"; // stub!
    const replyRepositoryPostgres = new ReplyRepositoryPostgres(
      pool,
      fakeIdGenerator
    );

    // Action
    const replies = await replyRepositoryPostgres.getReplyByThreadId(threadId);

    // Assert
    expect(replies).toBeDefined();
    expect(replies).toHaveLength(3);
    expect(replies[0].id).toEqual("reply-123");
    expect(replies[0].date).toEqual(new Date("2023-07-19T13:57:11.225Z"));
    expect(replies[0].username).toEqual("dicoding");
    expect(replies[0].content).toEqual("sebuah balasan");
    expect(replies[0].is_deleted).toEqual(true);
    expect(replies[0].comment_id).toEqual(commentId1);
    expect(replies[1].id).toEqual("reply-321");
    expect(replies[1].date).toEqual(new Date("2023-07-19T13:56:01.301Z"));
    expect(replies[1].username).toEqual("john doe");
    expect(replies[1].content).toEqual("sebuah balasan");
    expect(replies[1].is_deleted).toEqual(false);
    expect(replies[1].comment_id).toEqual(commentId2);
    expect(replies[2].id).toEqual("reply-456");
    expect(replies[2].date).toEqual(new Date("2023-07-19T13:59:01.301Z"));
    expect(replies[2].username).toEqual("john doe");
    expect(replies[2].content).toEqual("sebuah balasan");
    expect(replies[2].is_deleted).toEqual(false);
    expect(replies[2].comment_id).toEqual(commentId2);
  });

  describe("deleteReplyById function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        replyRepositoryPostgres.deleteReplyById("")
      ).rejects.toThrow(NotFoundError);
    });

    it("should delete reply by id and return success correctly", async () => {
      // Arrange
      const replyId = "reply-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: "comment-123" });
      await repliesTableTestHelper.addReply({ id: replyId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        {} as any
      );

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const replies = await repliesTableTestHelper.findReplyById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_deleted).toEqual(true);
    });
  });
});
