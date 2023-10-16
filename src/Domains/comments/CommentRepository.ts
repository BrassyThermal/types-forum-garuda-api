import AddedComment from "./entities/AddedComment";
import { InterfaceComment } from "./entities/CheckComment";

export default class CommentRepository {
  async addComment(addComment : object) : Promise<AddedComment> {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(commentId : string, owner : string) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkComment(commentId : object | string, threadId : string) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentByThreadId(
    threadId : string,
    action ?: boolean | InterfaceComment[]
  ) : Promise<InterfaceComment[]> {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteCommentById(id : string) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
