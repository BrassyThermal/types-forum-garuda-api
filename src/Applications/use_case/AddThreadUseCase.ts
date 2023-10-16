import ThreadRepository from "../../Domains/threads/ThreadRepository";
import AddThread, { type AddThreadPayload } from "../../Domains/threads/entities/AddThread";

interface AddThreadRepository {
  threadRepository : ThreadRepository;
}

export default class AddThreadUseCase {
  _threadRepository : ThreadRepository;

  constructor({ threadRepository } : AddThreadRepository) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload : AddThreadPayload) {
    const addThread = new AddThread(useCasePayload);
    return await this._threadRepository.addThread(addThread);
  }
}
