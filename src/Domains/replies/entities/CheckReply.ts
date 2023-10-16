export interface InterfaceReply {
  id : string;
  username : string;
  date : string;
  content : string;
  comment_id ?: string;
  is_deleted ?: boolean;
}

export default class CheckReply {
  private reply : InterfaceReply;

  constructor(payload : InterfaceReply) {
    const reply : InterfaceReply = { ...payload };

    if (reply.is_deleted) {
      reply.content = "**balasan telah dihapus**";
    }
    delete reply.is_deleted;
    delete reply.comment_id;

    this.reply = reply;
  }

  returnAction() : InterfaceReply {
    return this.reply;
  }
}
