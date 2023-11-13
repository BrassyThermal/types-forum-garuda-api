import UserRegistered from "../UserRegistered";

describe("an UserRegistered entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new UserRegistered(payload as any)).toThrow(
      "REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: "dicoding",
      fullname: {},
    };

    // Action and Assert
    expect(() => new UserRegistered(payload as any)).toThrow(
      "REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create userRegistered object correctly", () => {
    // Arrange
    const payload = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action
    const userRegistered = new UserRegistered(payload);

    // Assert
    expect(userRegistered).toBeInstanceOf(UserRegistered);
    expect(userRegistered.id).toEqual(payload.id);
    expect(userRegistered.username).toEqual(payload.username);
    expect(userRegistered.fullname).toEqual(payload.fullname);
  });
});
