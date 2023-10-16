import DeleteComment from "../DeleteComment";

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: null,
      commentId: "comment-123",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload as any)).toThrowError(
      "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: [],
      commentId: true,
      owner: {},
    };

    // Action and Assert
    expect(() => new DeleteComment(payload as any)).toThrowError(
      "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create deleteComment object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
