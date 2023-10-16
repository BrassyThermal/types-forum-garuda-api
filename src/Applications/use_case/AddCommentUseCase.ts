import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import AddComment, { type AddCommentPayload } from "../../Domains/comments/entities/AddComment";

interface AddCommentRepository {
  threadRepository : ThreadRepository;
  commentRepository : CommentRepository;
}

export default class AddCommentUseCase {
  _commentRepository : CommentRepository;
  _threadRepository : ThreadRepository;

  constructor({ threadRepository, commentRepository } : AddCommentRepository) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload : AddCommentPayload) {
    await this._threadRepository.checkThread(useCasePayload.threadId);
    const addComment = new AddComment(useCasePayload);
    return await this._commentRepository.addComment(addComment);
  }
}
