import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import LikeRepository from "../../Domains/likes/LikeRepository";
import AddLike, { AddLikePayload } from "../../Domains/likes/entities/AddLike";

interface AddLikeRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
  likeRepository : LikeRepository;
}

export default class AddLikeUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;
  _likeRepository : LikeRepository;

  constructor({
    threadRepository,
    commentRepository,
    likeRepository,
  } : AddLikeRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload : AddLikePayload) {
    const addLike = new AddLike(useCasePayload);

    await this._threadRepository.checkThread(
      addLike.threadId
    );
    await this._commentRepository.checkComment(
      addLike.commentId,
      addLike.threadId
    );
    const checkLike = await this._likeRepository.checkLike(
      addLike.commentId,
      addLike.owner
    );

    if (!checkLike) {
      await this._likeRepository.addLike(
        addLike.commentId,
        addLike.owner
      );
    } else {
      await this._likeRepository.checkStatus(
        checkLike
      );
    }
  }
}
