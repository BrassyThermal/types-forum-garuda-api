import { Request, ResponseToolkit } from "@hapi/hapi";
import { Container } from "instances-container";
import AddUserUseCase from "../../../../Applications/use_case/AddUserUseCase";

interface UsersRequestPayload {
  username : string;
  password : string;
  fullname : string;
}

export default class UsersHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.addUserHandler = this.addUserHandler.bind(this);
  }

  async addUserHandler(request : Request, h : ResponseToolkit) {
    const addUserUseCase : AddUserUseCase = this._container.getInstance(
      AddUserUseCase.name
    );
    const addedUser = await addUserUseCase.execute(
      request.payload as UsersRequestPayload
    );

    return h.response({
      status: "success",
      data: {
        addedUser,
      },
    }).code(201);
  }
}
