import { Request, ResponseToolkit } from "@hapi/hapi";
import { Container } from "instances-container";
import UserLoginUseCase from "../../../../Applications/use_case/UserLoginUseCase";
import RefreshAuthUseCase from "../../../../Applications/use_case/RefreshAuthUseCase";
import UserLogoutUseCase from "../../../../Applications/use_case/UserLogoutUseCase";

interface RequestPayload {
  username : string;
  password : string;
}

export default class AuthsHandler {
  _container : Container;

  constructor(container : Container) {
    this._container = container;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(request : Request, h : ResponseToolkit) {
    const userLoginUseCase : UserLoginUseCase = this._container.getInstance(
      UserLoginUseCase.name
    );
    const { accessToken, refreshToken } = await userLoginUseCase.execute(
      request.payload as RequestPayload
    );
    
    return h.response({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthHandler(request : Request) {
    const refreshAuthUseCase : RefreshAuthUseCase = this._container.getInstance(
      RefreshAuthUseCase.name
    );
    const accessToken = await refreshAuthUseCase.execute(
      request.payload as { refreshToken : string }
    );

    return {
      status: "success",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthHandler(request : Request) {
    const userLogoutUseCase = this._container.getInstance(
      UserLogoutUseCase.name
    );
    await userLogoutUseCase.execute(request.payload as { accessToken : string });
    return {
      status: "success",
    };
  }
}
