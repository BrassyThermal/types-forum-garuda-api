import { pool } from "../../database/postgres/pool";
import { usersTableTestHelper } from "../../../../tests_helper/usersTable";
import { accessTestHelper } from "../../../../tests_helper/access";
import { threadsTableTestHelper } from "../../../../tests_helper/threadsTable";
import { commentsTableTestHelper } from "../../../../tests_helper/commentsTable";
import { likesTableTestHelper } from "../../../../tests_helper/likesTable";
import { CreateServer } from "../CreateServer";
import { injection } from "../../injection";

describe("/likes endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await usersTableTestHelper.cleanTable();
    await threadsTableTestHelper.cleanTable();
    await commentsTableTestHelper.cleanTable();
    await likesTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should respond with status code 401 when access token does not exist", async () => {
      // Arrange
      const server = await CreateServer(injection);
      const threadId = "thread-123";
      const commentId = "comment-123";

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should respond with status code 404 when thread or comment does not exist", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/nothread/comments/nocomment/likes",
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

    it("should respond with status code 200 and persisted like", async () => {
      // Arrange
      const accessToken = await accessTestHelper.getToken();
      const server = await CreateServer(injection);

      const owner = "user-121";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await threadsTableTestHelper.addThread({ id: threadId, owner });
      await commentsTableTestHelper.addComment({ id: commentId, owner, threadId });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
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
