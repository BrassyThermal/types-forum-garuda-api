import CheckThread from "../CheckThread";

describe("a CheckThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = { threadId: null };

    // Action and Assert
    expect(() => new CheckThread(payload as any)).toThrow(
      "CHECK_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = { threadId: 123 };

    // Action and Assert
    expect(() => new CheckThread(payload as any)).toThrow(
      "CHECK_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create checkThread object correctly", () => {
    // Arrange
    const payload = { threadId: "thread-123" };

    // Action
    const checkThread = new CheckThread(payload);

    // Assert
    expect(checkThread).toBeInstanceOf(CheckThread);
    expect(checkThread.threadId).toEqual(payload.threadId);
  });
});
