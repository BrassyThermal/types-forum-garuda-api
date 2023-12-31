import AddedReply from "../AddedReply";

describe("an AddedReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: null,
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddedReply(payload as any)).toThrow(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: [],
      content: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedReply(payload as any)).toThrow(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedReply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
