export interface DeleteReplyPayload {
  threadId : string;
  commentId : string;
  replyId : string;
  owner : string;
}

export default class DeleteReply {
  threadId : string;
  commentId : string;
  replyId : string;
  owner : string;

  constructor(payload : DeleteReplyPayload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.replyId =  payload.replyId;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : DeleteReplyPayload) {
    const { threadId, commentId, replyId, owner } = payload;

    if (!threadId || !commentId || !replyId || !owner) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string" ||
      typeof commentId !== "string" ||
      typeof replyId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
