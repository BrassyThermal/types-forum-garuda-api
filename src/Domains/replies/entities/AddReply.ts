export interface AddReplyPayload {
  id ?: string;
  threadId : string;
  commentId : string;
  content : string;
  owner : string;
}

export default class AddReply {
  threadId : string;
  commentId : string;
  content : string;
  owner : string;

  constructor(payload : AddReplyPayload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload : AddReplyPayload) {
    const { threadId, commentId, content, owner } = payload;

    if (!content || !owner || !threadId || !commentId) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string" ||
      typeof commentId !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
