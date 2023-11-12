import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { likesTableTestHelper } from "../../../../tests_helper/likesTable";
import AddLike from "../../../Domains/likes/entities/AddLike";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import LikeRepositoryPostgres from "../LikeRepositoryPostgres";

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
    await likesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addLike function", () => {
    it("should persist post like and return posted like correctly", async () => {
      // Arrange
      const owner = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId });
      await commentsTableTestHelper.addComment({ id: commentId });
      const addLike = new AddLike({ owner, threadId, commentId });
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike.commentId, addLike.owner);

      // Assert
      const likes = await likesTableTestHelper.findLikeById("like-123");
      expect(likes).toBeDefined();
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual("like-123");
      expect(likes[0].comment_id).toEqual(addLike.commentId);
      expect(likes[0].owner).toEqual(addLike.owner);
      expect(likes[0].is_deleted).toEqual(false);
    });
  });

  describe("checkLike function", () => {
    it("should not return any like when like not found", async () => {
      // Arrange
      const commentId = "comment-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {} as any);

      // Action
      const like = await likeRepositoryPostgres.checkLike(commentId, "noowner");

      // Assert
      expect(like).toBeUndefined();
    });

    it("should return like when like is found", async () => {
      // Arrange
      const commentId = "comment-123";
      const owner = "user-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      await likesTableTestHelper.addLike({ id: "like-123" });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {} as any);

      // Action
      const like = await likeRepositoryPostgres.checkLike(commentId, owner);

      // Assert
      expect(like).toBeDefined();
      expect(like.id).toEqual("like-123");
      expect(like.is_deleted).toEqual(false);
    });
  });

  describe("checkStatus", () => {
    it("should return NotFoundError when like does not exist", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {} as any);

      // Action & Assert
      return expect(likeRepositoryPostgres.checkStatus({id : "like-123", is_deleted : false})).rejects.toThrowError(
        NotFoundError
      );
    });

    it("should change 'is_deleted' column successfully when like exists", async () => {
      // Arrange
      const commentId = "comment-123";
      const owner = "user-123";
      const likeId = "like-123";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: "thread-123" });
      await commentsTableTestHelper.addComment({ id: commentId });
      await likesTableTestHelper.addLike({ id: likeId });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {} as any);

      // Action
      await likeRepositoryPostgres.checkStatus({ id: likeId, is_deleted: false });

      // Assert
      const likes = await likesTableTestHelper.findLikeById(likeId);
      expect(likes).toBeDefined();
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual(likeId);
      expect(likes[0].comment_id).toEqual(commentId);
      expect(likes[0].owner).toEqual(owner);
      expect(likes[0].is_deleted).toEqual(true);
    });
  });

  describe("getLikeByThreadId function", () => {
    it("should show empty array if no comment found by thread ID", async () => {
      // Arrange
      const threadId = "thread-123";
      await usersTableTestHelper.addUser({ id: "user-123" });
      await threadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likeCounts = await likeRepositoryPostgres.getLikeByThreadId(threadId);

      // Assert
      expect(likeCounts).toBeDefined();
      expect(likeCounts).toHaveLength(0);
    });
  });

  it("should get like counts by thread ID correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const commentId1 = "comment-123";
    const commentId2 = "comment-321";
    const owner1 = "user-123";
    const owner2 = "user-321";
    await usersTableTestHelper.addUser({ id: owner1 });
    await usersTableTestHelper.addUser({ id: owner2, username: "uname2" });
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

    await likesTableTestHelper.addLike({
      id: "like-123",
      owner: owner1,
      commentId: commentId1,
      isDeleted: true,
    });
    await likesTableTestHelper.addLike({
      id: "like-231",
      owner: owner2,
      commentId: commentId2,
    });
    await likesTableTestHelper.addLike({
      id: "like-132",
      owner: owner2,
      commentId: commentId2,
    });
    const fakeIdGenerator = () => "123"; // stub!
    const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

    // Action
    const likeCounts = await likeRepositoryPostgres.getLikeByThreadId(threadId);

    // Assert
    expect(likeCounts).toBeDefined();
    expect(likeCounts).toHaveLength(2);
    expect(likeCounts[0].comment_id).toEqual(commentId1);
    expect(likeCounts[0].like_count).toEqual("0");
    expect(likeCounts[1].comment_id).toEqual(commentId2);
    expect(likeCounts[1].like_count).toEqual("2");
  });
});
