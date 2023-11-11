import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../Domains/replies/ReplyRepository";
import AddReply from "../../../Domains/replies/entities/AddReply";
import AddedReply from "../../../Domains/replies/entities/AddedReply";
import AddReplyUseCase from "../AddReplyUseCase";

describe("AddReplyUseCase", () => {
  it("should orchestrate the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      threadId: "thread-123",
      content: "content reply",
      owner: "user-123",
    };
    const expectedAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(
        new AddedReply({
          id: "reply-123",
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      )
    );
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockCommentRepository.checkComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockThreadRepository.checkThread).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
