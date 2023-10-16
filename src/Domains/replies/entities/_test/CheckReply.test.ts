import CheckReply from "../CheckReply";

describe("a CheckReply entities", () => {
  it("should mark the passed reply correctly if is_deleted is false", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "johndoe",
      date: "2021-08-08T07:59:48.766Z",
      content: "sebuah balasan",
      comment_id: "comment-123",
      is_deleted: false,
    };

    // Action
    const checkReply = new CheckReply(payload).returnAction();

    // Assert
    expect(checkReply).toBeDefined();
    expect(checkReply.id).toEqual(payload.id);
    expect(checkReply.username).toEqual(payload.username);
    expect(checkReply.date).toEqual(payload.date);
    expect(checkReply.content).toEqual(payload.content);
    expect(checkReply.comment_id).toBeUndefined();
    expect(checkReply.is_deleted).toBeUndefined();
  });

  it("should mark the passed reply correctly if is_deleted is true", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "dicoding",
      date: "2021-08-08T08:07:01.522Z",
      content: "sebuah balasan",
      comment_id: "comment-123",
      is_deleted: true,
    };

    // Action
    const checkReply = new CheckReply(payload).returnAction();

    // Assert
    expect(checkReply).toBeDefined();
    expect(checkReply.id).toEqual(payload.id);
    expect(checkReply.username).toEqual(payload.username);
    expect(checkReply.date).toEqual(payload.date);
    expect(checkReply.content).toEqual("**balasan telah dihapus**");
    expect(checkReply.comment_id).toBeUndefined();
    expect(checkReply.is_deleted).toBeUndefined();
  });
});
