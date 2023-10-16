import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { accessTestHelper } from "../../../../tests_helper/access";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { repliesTableTestHelper } from "../../../../tests_helper/repliesTable";
import { CreateServer } from "../CreateServer";
import { injection } from "../../injection";

describe("/replies endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
    await repliesTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should respond with status code 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should respond with status code 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = { content: 123 };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena tipe data tidak sesuai"
      );
    });

    it("should respond with status code 201 and persisted reply", async () => {
      // Arrange
      const requestPayload = { content: "sebuah balasan" };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should respond with status code 403 when user is not an authorized owner of the reply", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const otherUserId = "user-222";
      await usersTableTestHelper.addUser({
        id: otherUserId,
        username: "user-321",
      });

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });

      const commentId = "comment-123";
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      const replyId = "reply-123";
      await repliesTableTestHelper.addReply({
        id: replyId,
        owner: otherUserId,
        commentId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat mengakses resource ini"
      );
    });

    it("should respond with status code 404 when thread or comment does not exist", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/no-thread/comments/no-comment/replies/no-reply",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should respond with status code 200 and delete reply successfully", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });

      const commentId = "comment-123";
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      const replyId = "reply-123";
      await repliesTableTestHelper.addReply({ id: replyId, owner, commentId });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
