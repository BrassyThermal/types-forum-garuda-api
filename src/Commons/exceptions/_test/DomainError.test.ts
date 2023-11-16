import InvariantError from "../InvariantError";
import DomainErrorTranslator from "../DomainErrorTranslator";

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(DomainErrorTranslator.translate(
        new Error("USER_REGISTER.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("USER_REGISTER.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("USER_REGISTER.USERNAME_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("USER_REGISTER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError("harus mengirimkan username dan password")
    );

    expect(DomainErrorTranslator.translate(
        new Error("USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("username dan password harus string"));

    expect(DomainErrorTranslator.translate(
        new Error("REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan token refresh"));

    expect(DomainErrorTranslator.translate(
        new Error(
          "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
        )
      )
    ).toStrictEqual(new InvariantError("refresh token harus string"));

    expect(DomainErrorTranslator.translate(
        new Error("DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan token refresh"));

    expect(DomainErrorTranslator.translate(
        new Error(
          "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
        )
      )
    ).toStrictEqual(new InvariantError("refresh token harus string"));

    expect(DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("CHECK_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat melihat detail thread karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("CHECK_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat melihat detail thread karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat komentar baru karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menghapus komentar karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menghapus komentar karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat balasan baru karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menghapus balasan baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat menghapus balasan baru karena tipe data tidak sesuai"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat melakukan tindakan karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(DomainErrorTranslator.translate(
        new Error("ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat melakukan tindakan karena tipe data tidak sesuai"
      )
    );
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = (error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
