import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import AddReply, { type AddReplyPayload } from "../../Domains/replies/entities/AddReply";

interface AddReplyRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
  replyRepository : ReplyRepository;
}

export default class AddReplyUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;
  _replyRepository : ReplyRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  } : AddReplyRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload : AddReplyPayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.checkThread(addReply.threadId);
    await this._commentRepository.checkComment(
      addReply.commentId,
      addReply.threadId
    );
    const addedReply = await this._replyRepository.addReply(addReply);
    return addedReply;
  }
}
