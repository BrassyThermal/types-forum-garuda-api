import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { accessTestHelper } from "../../../../tests_helper/access";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { CreateServer } from "../CreateServer";
import { injection } from "../../injection";

describe("/comments endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/${threadId}/comments", () => {
    it("should respond with status code 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-121",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
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
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should respond with status code 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = { content: 123 };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-121",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
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
        "tidak dapat membuat komentar baru karena tipe data tidak sesuai"
      );
    });

    it("should respond with status code 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = { content: "sebuah comment" };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-121",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should respond with status code 404 when comment does not exist", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const threadId = "thread-321";
      await threadsTableTestHelper.addThread({
        id: threadId,
        owner: "user-121",
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/nocomment`,
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

    it("should respond with status code 404 when thread does not exist", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const threadId = "thread-321";
      const commentId = "comment-246";
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/nothread/comments/${commentId}`,
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

    it("should respond with status code 403 when user is not an authorized owner of the comment", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const anotherUserId = "user-not-owner";
      await usersTableTestHelper.addUser({
        id: anotherUserId,
        username: "user-152",
      });

      const threadId = "thread-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });

      const commentId = "comment-123";
      await commentsTableTestHelper.addComment({
        id: commentId,
        owner: anotherUserId,
        threadId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
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

    it("should respond with status code 201 and delete comment successfully", async () => {
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

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
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
