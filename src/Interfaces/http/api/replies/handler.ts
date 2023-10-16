import { Request, ResponseToolkit } from "@hapi/hapi";
import { Container } from "instances-container";
import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase";

export default class RepliesHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request : Request, h : ResponseToolkit) {
    const { content } = request.payload as { content : string };
    const { id: owner } = request.auth.credentials as { id : string };
    const { threadId, commentId } = request.params as {
      threadId : string;
      commentId : string;
    };
    const addReplyUseCase : AddReplyUseCase = this._container.getInstance(
      AddReplyUseCase.name
    );
    const addedReply = await addReplyUseCase.execute({
      content,
      owner,
      threadId,
      commentId,
    });

    return h.response({
      status: "success",
      data: { addedReply },
    }).code(201);
  }

  async deleteReplyHandler(request : Request, h : ResponseToolkit) {
    const { id: owner } = request.auth.credentials as { id : string };
    const { threadId, commentId, replyId } = request.params as {
      threadId : string;
      commentId : string;
      replyId : string;
    };
    const deleteReplyUseCase : DeleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

    return h.response({ status: "success" }).code(200);
  }
}
