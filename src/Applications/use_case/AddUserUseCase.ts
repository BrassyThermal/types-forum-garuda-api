import type UserRepository from "../../Domains/users/UserRepository";
import type PasswordHash from "../security/PasswordHash";
import UserRegister, { type UserRegisterPayload } from "../../Domains/users/entities/UserRegister";

interface AddUserRepository {
  userRepository : UserRepository;
  passwordHash : PasswordHash;
}

export default class AddUserUseCase {
  _userRepository : UserRepository;
  _passwordHash : PasswordHash;

  constructor({ userRepository, passwordHash } : AddUserRepository) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload : UserRegisterPayload) {
    const registerUser = new UserRegister(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(
      registerUser.password
    );
    return this._userRepository.addUser(registerUser);
  }
}
