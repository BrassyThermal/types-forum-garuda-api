import AddedReply from "./entities/AddedReply";
import { InterfaceReply } from "./entities/CheckReply";

export default class ReplyRepository {
  async addReply(addReply : object) : Promise<AddedReply> {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(replyId : string, owner : string) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }


  async checkReply(replyId : string, commentId : string) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getReplyByThreadId(
    threadId : string,
    action ?: boolean | InterfaceReply[]
  ) : Promise<InterfaceReply[]> {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReplyById(id : string) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}
