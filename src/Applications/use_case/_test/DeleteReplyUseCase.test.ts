import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../Domains/replies/ReplyRepository";
import DeleteReplyUseCase from "../DeleteReplyUseCase";

describe("DeleteReplyUseCase", () => {
  it("should orchestrate deletion of a reply correctly", async () => {
    // Arrange
    const useCasePayload = {
      replyId: "reply-123",
      commentId: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.checkReply = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.checkReply).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.commentId
    );
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(
      useCasePayload.replyId
    );
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
  });
});
