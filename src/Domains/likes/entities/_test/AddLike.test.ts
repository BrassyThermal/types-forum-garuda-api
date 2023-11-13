import AddLike from "../AddLike";

describe("a AddLike entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
    };

    // Action and Assert 
    expect(() => new AddLike(payload as any)).toThrow(
      "ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: true,
      owner: [],
    };

    // Action and Assert
    expect(() => new AddLike(payload as any)).toThrow(
      "ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addLike object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    // Action
    const addLike = new AddLike(payload);

    // Assert
    expect(addLike).toBeInstanceOf(AddLike);
    expect(addLike.threadId).toEqual(payload.threadId);
    expect(addLike.commentId).toEqual(payload.commentId);
    expect(addLike.owner).toEqual(payload.owner);
  });
});
