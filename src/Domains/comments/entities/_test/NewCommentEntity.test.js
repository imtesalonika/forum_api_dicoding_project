const NewCommentEntity = require("../NewCommentEntity");

describe("NewCommentEntity", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti content yang dibutuhkan", () => {
    const payload1 = {};
    const payload2 = { content: undefined };
    const payload3 = { content: null };

    expect(() => new NewCommentEntity(payload1)).toThrowError(
      "NEW_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new NewCommentEntity(payload2)).toThrowError(
      "NEW_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new NewCommentEntity(payload3)).toThrowError(
      "NEW_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika properti content memiliki tipe data yang salah", () => {
    const payload1 = { content: 123 };
    const payload2 = { content: true };
    const payload3 = { content: {} };

    expect(() => new NewCommentEntity(payload1)).toThrowError(
      "NEW_COMMENT_ENTITY.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
    expect(() => new NewCommentEntity(payload2)).toThrowError(
      "NEW_COMMENT_ENTITY.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
    expect(() => new NewCommentEntity(payload3)).toThrowError(
      "NEW_COMMENT_ENTITY.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
  });

  it("seharusnya melempar error ketika properti content adalah string kosong (setelah trim)", () => {
    const payload1 = { content: "" }; // string kosong
    const payload2 = { content: "   " }; // string hanya berisi spasi

    expect(() => new NewCommentEntity(payload1)).toThrowError(
      "NEW_COMMENT_ENTITY.CANNOT_BE_EMPTY_STRING",
    );
    expect(() => new NewCommentEntity(payload2)).toThrowError(
      "NEW_COMMENT_ENTITY.CANNOT_BE_EMPTY_STRING",
    );
  });

  it("seharusnya membuat objek NewCommentEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      content: "Ini adalah konten komentar yang valid.",
    };

    const newCommentEntity = new NewCommentEntity(payload);

    expect(newCommentEntity).toBeInstanceOf(NewCommentEntity);
    expect(newCommentEntity.content).toEqual(payload.content); // Atau payload.content.trim() jika Anda melakukan trim di constructor
  });

  it("seharusnya membuat objek NewCommentEntity dengan benar meskipun ada spasi di awal/akhir content", () => {
    const payload = {
      content: "  Konten dengan spasi di awal dan akhir.  ",
    };

    const newCommentEntity = new NewCommentEntity(payload);

    expect(newCommentEntity).toBeInstanceOf(NewCommentEntity);
    expect(newCommentEntity.content).toEqual(
      "  Konten dengan spasi di awal dan akhir.  ",
    );
  });
});
