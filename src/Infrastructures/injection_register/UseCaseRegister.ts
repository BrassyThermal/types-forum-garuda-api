/* istanbul ignore file */

// Importing Repository
import UserRepository from "../../Domains/users/UserRepository";
import AuthRepository from "../../Domains/auths/AuthRepository";
import ThreadRepository from "../../Domains/threads/ThreadRepository";
import CommentRepository from "../../Domains/comments/CommentRepository";
import ReplyRepository from "../../Domains/replies/ReplyRepository";
import LikeRepository from "../../Domains/likes/LikeRepository";

// Importing Security
import PasswordHash from "../../Applications/security/PasswordHash";
import AuthTokenManager from "../../Applications/security/AuthTokenManager";

// Importing Use Case
import AddUserUseCase from "../../Applications/use_case/AddUserUseCase";
import UserLoginUseCase from "../../Applications/use_case/UserLoginUseCase";
import UserLogoutUseCase from "../../Applications/use_case/UserLogoutUseCase";
import RefreshAuthUseCase from "../../Applications/use_case/RefreshAuthUseCase";
import AddThreadUseCase from "../../Applications/use_case/AddThreadUseCase";
import AddCommentUseCase from "../../Applications/use_case/AddCommentUseCase";
import AddReplyUseCase from "../../Applications/use_case/AddReplyUseCase";
import AddLikeUseCase from "../../Applications/use_case/AddLikeUseCase";
import CheckThreadDetailUseCase from "../../Applications/use_case/CheckThreadDetailUseCase";
import DeleteCommentUseCase from "../../Applications/use_case/DeleteCommentUseCase";
import DeleteReplyUseCase from "../../Applications/use_case/DeleteReplyUseCase";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UseCaseRegister = [
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },

  {
    key: UserLoginUseCase.name,
    Class: UserLoginUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authRepository",
          internal: AuthRepository.name,
        },
        {
          name: "authTokenManager",
          internal: AuthTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },

  {
    key: UserLogoutUseCase.name,
    Class: UserLogoutUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authRepository",
          internal: AuthRepository.name,
        },
      ],
    },
  },

  {
    key: RefreshAuthUseCase.name,
    Class: RefreshAuthUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authRepository",
          internal: AuthRepository.name,
        },
        {
          name: "authTokenManager",
          internal: AuthTokenManager.name,
        },
      ],
    },
  },

  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },

  {
    key: CheckThreadDetailUseCase.name,
    Class: CheckThreadDetailUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
        {
          name: "likeRepository",
          internal: LikeRepository.name,
        },
      ],
    },
  },

  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
      ],
    },
  },

  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
      ],
    },
  },

  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },

  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },

  {
    key: AddLikeUseCase.name,
    Class: AddLikeUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "likeRepository",
          internal: LikeRepository.name,
        },
      ],
    },
  },
];
