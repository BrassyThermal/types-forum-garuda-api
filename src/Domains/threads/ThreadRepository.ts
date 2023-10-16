import AddedThread from "./entities/AddedThread";

export interface GetThread {
  id : string;
  title : string;
  body : string;
  date : string;
  username : string;
}

export default class ThreadRepository {
  async addThread(addThread : object) : Promise<AddedThread> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkThread(id : string) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(threadId : string | GetThread) : Promise<GetThread> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
