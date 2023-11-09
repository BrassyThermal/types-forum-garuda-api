import CheckLike from "../CheckLike";

describe("a CheckLike entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange

    // Action and Assert 
    expect(() => new CheckLike("" as any)).toThrowError("CHECK_LIKE.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange

    // Action and Assert
    expect(() => new CheckLike("" as any)).toThrowError("CHECK_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create checkLike object correctly", () => {
    // Arrange

    // Action
    const checkLike = new CheckLike({});

    // Assert
  });
});
