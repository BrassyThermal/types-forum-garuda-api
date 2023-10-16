export interface AddThreadPayload {
  title : string;
  body : string;
  owner : string;
}

export default class AddThread {
  title : string;
  body : string;
  owner : string;

  constructor(payload : AddThreadPayload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : AddThreadPayload) {
    const { title, body, owner } = payload;

    if (!title || !body || !owner) {
      throw new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof title !== "string" || typeof body !== "string" || typeof owner !== "string") {
      throw new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
