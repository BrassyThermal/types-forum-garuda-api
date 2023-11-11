import AddLike from "../AddLike";

describe("a AddLike entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange

    // Action and Assert 
    expect(() => new AddLike("" as any)).toThrowError(
      "ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange

    // Action and Assert
    expect(() => new AddLike("" as any)).toThrowError(
      "ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addLike object correctly", () => {
    // Arrange

    // Action
    const addLike = new AddLike({});

    // Assert
  });
});
