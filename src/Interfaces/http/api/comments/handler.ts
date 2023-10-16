import { Container } from "instances-container";
import { Request, ResponseToolkit } from "@hapi/hapi";
import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase";

export default class CommentsHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request : Request, h : ResponseToolkit) {
    const { content } = request.payload as { content : string };
    const { id: owner } = request.auth.credentials as { id : string };
    const { threadId } = request.params as { threadId : string };
    const addCommentUseCase : AddCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute({
      content,
      owner,
      threadId,
    });

    return h.response({
      status: "success",
      data: { addedComment },
    }).code(201);
  }

  async deleteCommentHandler(request : Request, h : ResponseToolkit) {
    const { id: owner } = request.auth.credentials as { id : string };
    const { threadId, commentId } = request.params as {
      threadId : string;
      commentId : string;
    };
    const deleteCommentUseCase : DeleteCommentUseCase =
      this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return h.response({ status: "success" }).code(200);
  }
}
