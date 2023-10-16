import { Request, ResponseToolkit } from "@hapi/hapi";
import { Container } from "instances-container";
import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase";
import CheckThreadDetailUseCase from "../../../../Applications/use_case/CheckThreadDetailUseCase";

export default class ThreadsHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request : Request, h : ResponseToolkit) {
    const { title, body } = request.payload as { title : string; body : string };
    const { id } = request.auth.credentials as { id : string };
    const addThreadUseCase : AddThreadUseCase = this._container.getInstance(
      AddThreadUseCase.name
    );
    const addedThread = await addThreadUseCase.execute({
      title,
      body,
      owner: id,
    });

    return h.response({
      status: "success",
      data: { addedThread },
    }).code(201);
  }

  async getThreadDetailHandler(request : Request, h : ResponseToolkit) {
    const { threadId } = request.params as { threadId : string };
    const checkThreadDetailUseCase : CheckThreadDetailUseCase =
      this._container.getInstance(CheckThreadDetailUseCase.name);
    const threadDetail = await checkThreadDetailUseCase.execute({ threadId });

    return h.response({
      status: "success",
      data: { thread: threadDetail },
    }).code(200);
  }
}
