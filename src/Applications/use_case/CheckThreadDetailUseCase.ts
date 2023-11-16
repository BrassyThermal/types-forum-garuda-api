import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import LikeRepository, { like_count } from "../../Domains/likes/LikeRepository";
import CheckThread from "../../Domains/threads/entities/CheckThread";
import CheckComment, { type InterfaceComment } from "../../Domains/comments/entities/CheckComment";
import CheckReply, { type InterfaceReply } from "../../Domains/replies/entities/CheckReply";

interface CheckThreadDetailRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
  replyRepository : ReplyRepository;
  likeRepository : LikeRepository;
}

export default class CheckThreadDetailUseCase {
  _threadRepository : ThreadRepository;
  _commentRepository : CommentRepository;
  _replyRepository : ReplyRepository;
  _likeRepository : LikeRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository
  } : CheckThreadDetailRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
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
    const likes = await this._likeRepository.getLikeByThreadId(
      threadDetail.threadId,
    );
    const checkedComment = this._checkComment(
      new CheckComment(comments).returnAction(),
      replies,
      likes
    );

    return {
      ...thread,
      comments: checkedComment,
    };
  }

  private _checkComment(
    comments : InterfaceComment[], 
    replies : InterfaceReply[], 
    likes : like_count[]
  ) {
    let a = 0;
    let b = 0;

    for (const comment of comments) {
      comment.replies = [];
      comment.likeCount = Number(likes[b++].like_count);
      while (a < replies.length && replies[a].comment_id === comment.id) {
        comment.replies.push(new CheckReply(replies[a++]).returnAction());
      }
    }
    return comments;
  }
}
