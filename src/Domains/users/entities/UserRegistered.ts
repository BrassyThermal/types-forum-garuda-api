interface UserRegisteredPayload {
  id : string;
  username : string;
  fullname : string;
}

export default class UserRegistered {
  id : string;
  username : string;
  fullname : string;

  constructor(payload : UserRegisteredPayload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.fullname = payload.fullname;
  }

  private _verifyPayload(payload : UserRegisteredPayload) {
    const { id, username, fullname } = payload;
    
    if (!id || !username || !fullname) {
      throw new Error("REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string"
    ) {
      throw new Error("REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
