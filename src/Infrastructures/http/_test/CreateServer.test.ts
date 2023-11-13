import { Container } from "instances-container";
import { CreateServer } from "../CreateServer";

describe("HTTP server", () => {
  it("should response 404 when request unregistered route", async () => {
    // Arrange
    const server = await CreateServer({} as Container);

    // Action
    const response = await server.inject({
      method: "GET",
      url: "/unregisteredRoute",
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  describe("when GET /", () => {
    it("should return 200 and hello world", async () => {
      // Arrange
      const server = await CreateServer({} as Container);
      
      // Action
      const response = await server.inject({
        method: "GET",
        url: "/",
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
    });
  });

  it("should handle server error correctly", async () => {
    // Arrange
    const requestPayload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    };
    const server = await CreateServer({} as Container); // fake injection

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual("error");
    expect(responseJson.message).toEqual("terjadi kegagalan pada server kami");
  });
});
