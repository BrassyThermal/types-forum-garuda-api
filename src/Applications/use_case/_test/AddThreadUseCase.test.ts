import ThreadRepository from "../../../Domains/threads/ThreadRepository";
import AddThread from "../../../Domains/threads/entities/AddThread";
import AddedThread from "../../../Domains/threads/entities/AddedThread";
import AddThreadUseCase from "../AddThreadUseCase";

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "sebuah thread",
      body: "sebuah body thread",
      owner: "user-123",
    };
    const expectedAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(
        new AddedThread({
          id: "thread-123",
          title: useCasePayload.title,
          owner: useCasePayload.owner,
        })
      )
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });
});
