import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { accessTestHelper } from "../../../../tests_helper/access";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { repliesTableTestHelper } from "../../../../tests_helper/repliesTable";
import { likesTableTestHelper } from "../../../../tests_helper/likesTable";
import { CreateServer } from "../CreateServer";
import { injection } from "../../injection";

describe("/threads endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
    await repliesTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should respond with status code 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread",
      };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
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
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should respond with status code 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: {},
        body: [],
      };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
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
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });

    it("should respond with status code 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread",
        body: "sebuah body thread",
      };
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should respond with status code 404 when thread with threadId not found", async () => {
      // Arrange
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/nothread",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should respond with status code 200 and get thread detail by id", async () => {
      // Arrange
      const threadId = "thread-123";
      const owner = "user-123";
      const commentId1 = "comment-_pby2_tmXV6bcvcdev8xk";
      const commentId2 = "comment-yksuCoxM2s4MMrZJO-qVD";
      const username = "dicoding";
      await usersTableTestHelper.addUser({ id: owner });
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({
        id: commentId1,
        owner,
        threadId,
      });
      await commentsTableTestHelper.addComment({
        id: commentId2,
        owner,
        threadId,
        isDeleted: true,
        date: "2021-08-08T07:27:21.338Z",
      });
      await repliesTableTestHelper.addReply({
        id: "reply-123",
        owner,
        commentId: commentId1,
        date: "2021-08-12T07:26:21.338Z",
      });
      await likesTableTestHelper.addLike({
        id: "like-123",
        commentId: commentId2,
        owner,
      });
      const expectedComments = [
        {
          id: commentId1,
          username,
          date: "2021-08-08T07:26:21.338Z",
          content: "sebuah comment",
          replies: [
            {
              id: "reply-123",
              content: "sebuah balasan",
              username,
              date: "2021-08-12T07:26:21.338Z",
            },
          ],
          likeCount: 0
        },
        {
          id: commentId2,
          username,
          date: "2021-08-08T07:27:21.338Z",
          content: "**komentar telah dihapus**",
          replies: [],
          likeCount: 1
        },
      ];
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toStrictEqual(expectedComments);
    });
  });
});
