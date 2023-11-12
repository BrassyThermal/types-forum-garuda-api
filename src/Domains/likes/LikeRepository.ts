export interface checkLike {
  id : string;
  is_deleted : boolean;
}

export interface like_count {
  like_count : string;
  commentId : string;
}

export default class LikeRepository {
  async addLike(commentId : string, owner : string) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkLike(commentId : string, owner : string) : Promise<void | checkLike> {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkStatus(payload : object) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLikeByThreadId(threadId : string) : Promise<like_count[]> {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}
