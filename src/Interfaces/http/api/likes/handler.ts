import { Container } from "instances-container";
import { Request, ResponseToolkit } from "@hapi/hapi";
import AddLikeUseCase from "../../../../Applications/use_case/AddLikeUseCase";

export default class LikesHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request : Request, h : ResponseToolkit) {
    const { id: owner } = request.auth.credentials as {id : string};
    const { threadId, commentId } = request.params as {
      threadId : string;
      commentId : string;
    };
    const addLikeUseCase : AddLikeUseCase =
      this._container.getInstance(AddLikeUseCase.name);
    await addLikeUseCase.execute({ threadId, commentId, owner });

    return h.response({ status: "success" }).code(200);
  }
}
