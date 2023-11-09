export default class LikeRepository {
  async addLike(commentId : string, owner : string) {
    //adding like
  }

  async checkLike(commentId : string, owner : string) {
    //checking like
  }

  async uncheckLike(payload : object) {
    //unchecking like
  }

  async getLikeByThreadId(threadId : object) {
    //get like counts
  }
}
