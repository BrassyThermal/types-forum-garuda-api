import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import AddComment from "../../../Domains/comments/entities/AddComment";
import AddedComment from "../../../Domains/comments/entities/AddedComment";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres";

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist post comment and return posted comment correctly", async () => {
      // Arrange
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      const addComment = new AddComment({
        content: "sebuah comment",
        owner: "user-123",
        threadId: "thread-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const postedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      const comments = await commentsTableTestHelper.findCommentById(
        postedComment.id as string
      );
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual("comment-123");
      expect(comments[0].content).toEqual(addComment.content);
      expect(comments[0].owner).toEqual(addComment.owner);
      expect(postedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: addComment.content as string,
          owner: addComment.owner as string,
        })
      );
    });
  });

  describe("checkComment function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: threadId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.checkComment("", threadId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const commentId = "comment-123";
      const threadId = "thread-123";
      const owner = "user-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.checkComment(commentId, "")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when comment found", async () => {
      // Arrange
      const commentId = "comment-123";
      const threadId = "thread-123";
      const owner = "user-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.checkComment(commentId, threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw UnauthorizedError when provided userId is not the comment owner", async () => {
      // Arrange
      const commentId = "comment-123";
      const userId = "user-123";
      const wrongUserId = "user-321";
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: userId });
      await threadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, wrongUserId)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should verify the comment owner correctly", async () => {
      // Arrange
      const commentId = "comment-123";
      const userId = "user-123";
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: userId });
      await threadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, userId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getCommentByThreadId function", () => {
    it("should show empty array if no comment found by thread ID", async () => {
      // Arrange
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(0);
    });
  });

  describe("deleteCommentById function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action & Assert
      return expect(
        commentRepositoryPostgres.deleteCommentById("")
      ).rejects.toThrow(NotFoundError);
    });

    it("should delete comment by id and return success correctly", async () => {
      // Arrange
      const commentId = "comment-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {} as any
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comments = await commentsTableTestHelper.findCommentById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_deleted).toEqual(true);
    });
  });

  it("should get comments by thread ID correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    await usersTableTestHelper.addUser({ id: "user-123" });
    await usersTableTestHelper.addUser({ id: "user-321", username: "john doe" });
    await threadsTableTestHelper.addThread({ id: threadId });
    await commentsTableTestHelper.addComment({
      id: "comment-123",
      owner: "user-123",
      threadId,
      date: "2023-07-19T13:57:11.225Z",
      isDeleted: true,
    });
    await commentsTableTestHelper.addComment({
      id: "comment-321",
      owner: "user-321",
      threadId,
      date: "2023-07-19T13:56:01.301Z",
    });
    const fakeIdGenerator = () => "123"; // stub!
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator
    );

    // Action
    const comments = await commentRepositoryPostgres.getCommentByThreadId(
      threadId
    );

    // Assert
    expect(comments).toBeDefined();
    expect(comments).toHaveLength(2);
    expect(comments[0].id).toEqual("comment-321");
    expect(comments[0].date).toEqual(new Date("2023-07-19T13:56:01.301Z"));
    expect(comments[0].username).toEqual("john doe");
    expect(comments[0].content).toEqual("sebuah comment");
    expect(comments[0].is_deleted).toEqual(false);
    expect(comments[1].id).toEqual("comment-123");
    expect(comments[1].date).toEqual(new Date("2023-07-19T13:57:11.225Z"));
    expect(comments[1].username).toEqual("dicoding");
    expect(comments[1].content).toEqual("sebuah comment");
    expect(comments[1].is_deleted).toEqual(true);
  });
});
