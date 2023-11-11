import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../Domains/comments/CommentRepository";
import AddComment from "../../../Domains/comments/entities/AddComment";
import AddedComment from "../../../Domains/comments/entities/AddedComment";
import AddCommentUseCase from "../AddCommentUseCase";

describe("AddCommentUseCase", () => {
  it("should orchestrate the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      content: "sebuah comment",
      owner: "user-123",
    };
    const expectedAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(
        new AddedComment({
          id: "comment-123",
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      )
    );
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.checkThread).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
