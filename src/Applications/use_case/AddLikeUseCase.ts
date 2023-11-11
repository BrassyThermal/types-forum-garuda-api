interface AddLikeRepository {
  threadRepository : object;
  commentRepository : object;
  likeRepository : object;
}

export default class AddLikeUseCase {
  constructor({threadRepository} : AddLikeRepository ) {
    //instance
  }

  async execute(useCasePayload : object) {
    //method for like comment
  }
}
