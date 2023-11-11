import LikeRepository from "../LikeRepository";

describe("LikeRepository", () => {
  it("should throw error when invoked abstract behavior", async () => {
    //Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.addLike("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.checkLike("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.checkStatus({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.getLikeByThreadId("")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
