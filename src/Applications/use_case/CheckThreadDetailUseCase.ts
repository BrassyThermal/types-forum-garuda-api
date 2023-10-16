import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import CheckThread from "../../Domains/threads/entities/CheckThread";
import CheckComment, { type InterfaceComment } from "../../Domains/comments/entities/CheckComment";
import CheckReply, { type InterfaceReply } from "../../Domains/replies/entities/CheckReply";

interface CheckThreadDetailRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
  replyRepository : ReplyRepository;
}

export default class CheckThreadDetailUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;
  _replyRepository : ReplyRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  } : CheckThreadDetailRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload : { threadId : string }) {
    const threadDetail = new CheckThread(useCasePayload);
    const thread = await this._threadRepository.getThreadById(
      threadDetail.threadId
    );
    const comments = await this._commentRepository.getCommentByThreadId(
      threadDetail.threadId,
      true
    );
    const replies = await this._replyRepository.getReplyByThreadId(
      threadDetail.threadId,
      true
    );

    const checkedComment = this._checkComment(
      new CheckComment(comments).returnAction(),
      replies
    );

    return {
      ...thread,
      comments: checkedComment,
    };
  }

  private _checkComment(comments : InterfaceComment[], replies : InterfaceReply[]) {
    let i = 0;
    for (const comment of comments) {
      comment.replies = [];
      while (i < replies.length && replies[i].comment_id === comment.id) {
        comment.replies.push(new CheckReply(replies[i++]).returnAction());
      }
    }
    return comments;
  }
}
