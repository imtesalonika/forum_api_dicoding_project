const CommentEntity = require("../CommentEntity");

describe("CommentEntity", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const validDate = new Date();
    expect(
      () =>
        new CommentEntity({
          content: "A",
          date: validDate,
          userId: "u",
          threadId: "t",
          isDelete: false,
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(
      () =>
        new CommentEntity({
          id: "c",
          date: validDate,
          userId: "u",
          threadId: "t",
          isDelete: false,
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(
      () =>
        new CommentEntity({
          id: "c",
          content: "A",
          userId: "u",
          threadId: "t",
          isDelete: false,
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(
      () =>
        new CommentEntity({
          id: "c",
          content: "A",
          date: validDate,
          threadId: "t",
          isDelete: false,
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(
      () =>
        new CommentEntity({
          id: "c",
          content: "A",
          date: validDate,
          userId: "u",
          isDelete: false,
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(
      () =>
        new CommentEntity({
          id: "c",
          content: "A",
          date: validDate,
          userId: "u",
          threadId: "t",
        }),
    ).toThrowError("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const validDate = new Date();
    const validPayload = {
      id: "c-123",
      content: "Valid comment",
      date: validDate,
      userId: "user-123",
      threadId: "thread-123",
      isDelete: false,
    };

    expect(() => new CommentEntity({ ...validPayload, id: 123 })).toThrowError(
      "COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
    expect(
      () => new CommentEntity({ ...validPayload, content: 123 }),
    ).toThrowError("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new CommentEntity({ ...validPayload, date: "2023-10-27" }),
    ).toThrowError("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new CommentEntity({ ...validPayload, userId: 123 }),
    ).toThrowError("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new CommentEntity({ ...validPayload, threadId: 123 }),
    ).toThrowError("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new CommentEntity({ ...validPayload, isDelete: "false" }),
    ).toThrowError("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("seharusnya membuat objek CommentEntity dengan benar ketika diberi payload yang sesuai", () => {
    const now = new Date();
    const payload = {
      id: "comment-xyz-789",
      content: "Ini adalah konten komentar yang valid untuk pengujian.",
      date: now,
      userId: "user-abc-123",
      threadId: "thread-def-456",
      isDelete: false,
    };

    const commentEntity = new CommentEntity(payload);

    expect(commentEntity).toBeInstanceOf(CommentEntity);
    expect(commentEntity.id).toEqual(payload.id);
    expect(commentEntity.content).toEqual(payload.content);
    expect(commentEntity.date).toEqual(payload.date);
    expect(commentEntity.userId).toEqual(payload.userId);
    expect(commentEntity.threadId).toEqual(payload.threadId);
    expect(commentEntity.isDelete).toEqual(payload.isDelete);
  });

  it("seharusnya membuat CommentEntity dengan benar dengan nilai isDelete true", () => {
    const now = new Date();
    const payload = {
      id: "comment-del-001",
      content: "Komentar ini seharusnya ditandai sebagai telah dihapus.",
      date: now,
      userId: "user-mod-007",
      threadId: "thread-archive-001",
      isDelete: true,
    };

    const commentEntity = new CommentEntity(payload);

    expect(commentEntity.isDelete).toEqual(true);
    expect(commentEntity.content).toEqual(payload.content);
  });

  it("seharusnya memastikan properti date adalah instance dari Date", () => {
    const payload = {
      id: "comment-date-check",
      content: "Mengecek instance tanggal.",
      date: new Date(),
      userId: "user-date-checker",
      threadId: "thread-date-check",
      isDelete: false,
    };
    const commentEntity = new CommentEntity(payload);
    expect(commentEntity.date).toBeInstanceOf(Date);
  });
});
