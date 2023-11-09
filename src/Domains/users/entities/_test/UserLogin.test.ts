import UserLogin from "../UserLogin";

describe("an UserLogin entities", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Arrange
    const payload = {
      username: "dicoding",
    };
  
    // Action & Assert
    expect(() => new UserLogin(payload as any)).toThrowError(
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      password: 12345, // Change to 12345 as any to simulate incorrect type
    };

    // Action & Assert
    expect(() => new UserLogin(payload as any)).toThrowError(
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create userLogin entities correctly", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      password: "12345",
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
