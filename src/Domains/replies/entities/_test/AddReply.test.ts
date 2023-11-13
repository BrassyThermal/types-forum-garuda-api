import AddReply from "../AddReply";

describe("an AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "sebuah balasan",
      owner: "user-123",
      threadId: null,
    };

    // Action and Assert
    expect(() => new AddReply(payload as any)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: true,
      owner: 123,
      threadId: {},
      commentId: [],
    };

    // Action and Assert
    expect(() => new AddReply(payload as any)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addReply object correctly", () => {
    // Arrange
    const payload = {
      content: "sebuah balasan",
      owner: "user-123",
      threadId: "thread-123",
      commentId: "comment-123",
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.threadId).toEqual(payload.threadId);
    expect(addReply.commentId).toEqual(payload.commentId);
  });
});
