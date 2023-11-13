export interface UserRegisterPayload {
  username : string;
  password : string;
  fullname : string;
}

export default class UserRegister {
  username : string;
  password : string;
  fullname : string;

  constructor(payload : UserRegisterPayload) {
    this._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
    this.fullname = payload.fullname;
  }

  private _verifyPayload(payload : UserRegisterPayload) {
    const { username, password, fullname } = payload;

    if (!username || !password || !fullname) {
      throw new Error("USER_REGISTER.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof username !== "string" || typeof password !== "string" || typeof fullname !== "string") {
      throw new Error("USER_REGISTER.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (username.length > 50) {
      throw new Error("USER_REGISTER.USERNAME_LIMIT_CHAR");
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error("USER_REGISTER.USERNAME_CONTAIN_RESTRICTED_CHARACTER");
    }
  }
}
