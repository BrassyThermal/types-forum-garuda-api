interface AddedThreadPayload {
  id : string;
  title : string;
  owner : string;
}

export default class AddedThread {
  id : string;
  title : string;
  owner : string;
  
  constructor(payload : AddedThreadPayload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _verifyPayload(payload : AddedThreadPayload) {
    const { id, title, owner } = payload;

    if (!id || !title || !owner) {
      throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof title !== "string" || typeof owner !== "string") {
      throw new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
