import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../Domains/comments/CommentRepository";
import LikeRepository from "../../../Domains/likes/LikeRepository";
import AddLikeUseCase from "../AddLikeUseCase";

describe("AddLikeUseCase", () => {
  it("should orchestrate the post like action correctly when like does not exist", async () => {
    //Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123"
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLike = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository
    });

    //Action
    await addLikeUseCase.execute(useCasePayload);
    
    //Assert
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
      );
  });

  it("should orchestrate the post like action correctly when like exists", async () => {
    //Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123"
    };
    const addedLike = {
      id: "like-123",
      is_deleted: false
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockLikeRepository.checkLike = jest.fn(() =>
      Promise.resolve({
        id: "like-123",
        is_deleted: false,
      })
    );
    mockLikeRepository.checkStatus = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository
    });

    //Action
    await addLikeUseCase.execute(useCasePayload);

    //Assert
    expect(mockLikeRepository.checkStatus).toHaveBeenCalledWith(addedLike);
    expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.checkComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
  });
});
