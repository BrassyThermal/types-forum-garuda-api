import CommentRepository from "../CommentRepository";

describe("CommentRepository", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({} as any)).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.checkComment({}, "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.verifyCommentOwner("", "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentByThreadId("", [])).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteCommentById("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
