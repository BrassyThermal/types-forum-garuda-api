import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import DeleteComment, { type DeleteCommentPayload } from "../../Domains/comments/entities/DeleteComment";

interface DeleteCommentRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
}

export default class DeleteCommentUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;

  constructor({
    threadRepository,
    commentRepository,
  } : DeleteCommentRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload : DeleteCommentPayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.checkThread(deleteComment.threadId);
    await this._commentRepository.checkComment(
      deleteComment.commentId,
      deleteComment.threadId
    );
    await this._commentRepository.verifyCommentOwner(
      deleteComment.commentId,
      deleteComment.owner
    );

    return await this._commentRepository.deleteCommentById(
      deleteComment.commentId
    );
  }
}
