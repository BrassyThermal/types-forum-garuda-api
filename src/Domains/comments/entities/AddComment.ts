export interface AddCommentPayload {
  threadId : string;
  content : string;
  owner : string;
}

export default class AddComment {
  threadId : string;
  content : string;
  owner : string;
  
  constructor(payload : AddCommentPayload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : AddCommentPayload) {
    const { threadId, content, owner } = payload;

    if (!threadId || !content || !owner) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof threadId !== "string" || typeof content !== "string" || typeof owner !== "string") {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
