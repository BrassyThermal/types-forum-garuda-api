import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import DeleteReply, { type DeleteReplyPayload } from "../../Domains/replies/entities/DeleteReply";

interface DeleteReplyRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
  replyRepository : ReplyRepository;
}

export default class DeleteReplyUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;
  _replyRepository : ReplyRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  } : DeleteReplyRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload : DeleteReplyPayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.checkThread(deleteReply.threadId);
    await this._commentRepository.checkComment(
      deleteReply.commentId,
      deleteReply.threadId
    );
    await this._replyRepository.checkReply(
      deleteReply.replyId,
      deleteReply.commentId
    );
    await this._replyRepository.verifyReplyOwner(
      deleteReply.replyId,
      deleteReply.owner
    );

    return await this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}
