import { InterfaceReply } from "../../replies/entities/CheckReply";

export interface InterfaceComment {
  id : string;
  username : string;
  date : string;
  content : string;
  is_deleted ?: boolean;
  replies ?: InterfaceReply[];
  likeCount ?: number;
}

export default class CheckComment {
  private comments : InterfaceComment[];

  constructor(payload : InterfaceComment[]) {
    const checkedComment = this._verifyAction(payload);
    this.comments = checkedComment;
  }

  returnAction() : InterfaceComment[] {
    return this.comments;
  }

  private _verifyAction(comments : InterfaceComment[]) {
    for (const comment of comments) {
      if (comment.is_deleted) {
        comment.content = "**komentar telah dihapus**";
      }
      delete comment.is_deleted;
    }
    return comments;
  }
}
