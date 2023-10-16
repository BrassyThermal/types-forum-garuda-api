interface AddedReplyPayload {
  id : string;
  content : string;
  owner : string;
}

export default class AddedReply {
  id : string;
  content : string;
  owner : string;
  
  constructor(payload : AddedReplyPayload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : AddedReplyPayload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof content !== "string" || typeof owner !== "string") {
      throw new Error("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
