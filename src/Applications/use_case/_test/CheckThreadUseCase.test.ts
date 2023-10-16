import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import CommentRepository from "../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../Domains/replies/ReplyRepository";
import CheckThreadDetailUseCase from "../CheckThreadDetailUseCase";

describe("CheckThreadDetailUseCase", () => {
  it("should orchestrate the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = { threadId: "thread-123" };
    const expectedThread = {
      id: "thread-h_2FkLZhtgBKY2kh4CC02",
      username: "user1",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
    };

    const commentId1 = "comment-_pby2_tmXV6bcvcdev8xk";
    const commentId2 = "comment-yksuCoxM2s4MMrZJO-qVD";

    const expectedComments = [
      {
        id: commentId1,
        username: "user2",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: commentId2,
        username: "user3",
        date: "2021-08-08T07:26:21.338Z",
        content: "**komentar telah dihapus**",
      },
    ];

    const expectedReplies = [
      {
        id: "reply-BErOXUSefjwWGW1Z10Ihk",
        username: "johndoe",
        content: "**balasan telah dihapus**",
        date: "2021-08-08T07:59:48.766Z",
        comment_id: commentId1,
      },
      {
        id: "reply-xNBtm9HPR-492AeiimpfN",
        username: "dicoding",
        content: "sebuah balasan",
        date: "2021-08-08T08:07:01.522Z",
        comment_id: commentId1,
      },
    ];

    const expectedResult = {
      id: "thread-h_2FkLZhtgBKY2kh4CC02",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "user1",
      comments: [
        {
          id: commentId1,
          username: "user2",
          date: "2021-08-08T07:22:33.555Z",
          replies: [
            {
              id: "reply-BErOXUSefjwWGW1Z10Ihk",
              username: "johndoe",
              content: "**balasan telah dihapus**",
              date: "2021-08-08T07:59:48.766Z",
            },
            {
              id: "reply-xNBtm9HPR-492AeiimpfN",
              username: "dicoding",
              content: "sebuah balasan",
              date: "2021-08-08T08:07:01.522Z",
            },
          ],
          content: "sebuah comment",
        },
        {
          id: commentId2,
          username: "user3",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
          replies: [],
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(expectedThread)
    );
    mockCommentRepository.getCommentByThreadId = jest.fn(() =>
      Promise.resolve(expectedComments)
    );
    mockReplyRepository.getReplyByThreadId = jest.fn(() =>
      Promise.resolve(expectedReplies)
    );

    /** creating use case instance */
    const checkThreadDetailUseCase = new CheckThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await checkThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCasePayload.threadId,
      true
    );
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(
      useCasePayload.threadId,
      true
    );
  });
});
