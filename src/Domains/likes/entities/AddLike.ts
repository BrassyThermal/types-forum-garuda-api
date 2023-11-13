export interface AddLikePayload {
  threadId : string;
  commentId : string;
  owner : string;
}

export default class AddLike {
  threadId : string;
  commentId : string;
  owner : string;

  constructor(payload : AddLikePayload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : AddLikePayload) {
    const { threadId, commentId, owner } = payload;

    if (!threadId || !commentId || !owner) {
      throw new Error("ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof threadId !== "string" || typeof commentId !== "string" || typeof owner !== "string") {
      throw new Error("ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
