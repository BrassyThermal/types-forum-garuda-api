import CheckComment from "../CheckComment";

describe("a CheckComment entities", () => {
  it("should mark the passed comments correctly", () => {
    // Arrange
    const payload = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_deleted: false,
      },

      {
        id: "comment-123",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "**komentar telah dihapus**",
        is_deleted: true,
      },
    ];

    // Action
    const checkComment = new CheckComment(payload).returnAction();

    // Assert
    expect(checkComment).toBeDefined();
    expect(checkComment).toHaveLength(2);
    expect(checkComment[0].id).toEqual(payload[0].id);
    expect(checkComment[0].username).toEqual(payload[0].username);
    expect(checkComment[0].date).toEqual(payload[0].date);
    expect(checkComment[0].content).toEqual(payload[0].content);
    expect(checkComment[0].is_deleted).toBeUndefined();
    expect(checkComment[1].id).toEqual(payload[1].id);
    expect(checkComment[1].username).toEqual(payload[1].username);
    expect(checkComment[1].date).toEqual(payload[1].date);
    expect(checkComment[1].content).toEqual("**komentar telah dihapus**");
    expect(checkComment[1].is_deleted).toBeUndefined();
  });
});
