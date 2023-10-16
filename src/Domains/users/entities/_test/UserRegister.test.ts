import UserRegister from "../UserRegister";

describe("a UserRegister entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "abc",
      password: null,
    };

    // Action and Assert
    expect(() => new UserRegister(payload as any)).toThrowError(
      "USER_REGISTER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      username: 123,
      fullname: true,
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload as any)).toThrowError(
      "USER_REGISTER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when username contains more than 50 character", () => {
    // Arrange
    const payload = {
      username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
      fullname: "Dicoding Indonesia",
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError(
      "USER_REGISTER.USERNAME_LIMIT_CHAR"
    );
  });

  it("should throw error when username contains restricted character", () => {
    // Arrange
    const payload = {
      username: "dico ding",
      fullname: "dicoding",
      password: "abc",
    };

    // Action and Assert
    expect(() => new UserRegister(payload)).toThrowError(
      "USER_REGISTER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  it("should create userRegister object correctly", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "abc",
    };

    // Action
    const userRegister = new UserRegister(payload);

    // Assert
    expect(userRegister).toBeInstanceOf(UserRegister);
    expect(userRegister.username).toEqual(payload.username);
    expect(userRegister.fullname).toEqual(payload.fullname);
    expect(userRegister.password).toEqual(payload.password);
  });
});
