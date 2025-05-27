const DeleteCommentEntity = require("../DeleteCommentEntity");

describe("DeleteCommentEntity", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = { threadId: "thread-123", userId: "user-123" };
    const payload2 = { commentId: "comment-123", userId: "user-123" };
    const payload3 = { commentId: "comment-123", threadId: "thread-123" };
    const payload4 = {};

    expect(() => new DeleteCommentEntity(payload1)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new DeleteCommentEntity(payload2)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new DeleteCommentEntity(payload3)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new DeleteCommentEntity(payload4)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const validPayload = {
      commentId: "comment-123",
      threadId: "thread-123",
      userId: "user-123",
    };
    expect(
      () => new DeleteCommentEntity({ ...validPayload, commentId: 123 }),
    ).toThrowError("DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new DeleteCommentEntity({ ...validPayload, threadId: true }),
    ).toThrowError("DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new DeleteCommentEntity({ ...validPayload, userId: {} }),
    ).toThrowError("DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("seharusnya membuat objek DeleteCommentEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      commentId: "comment-xyz-789",
      threadId: "thread-abc-123",
      userId: "user-def-456",
    };

    const deleteCommentEntity = new DeleteCommentEntity(payload);

    expect(deleteCommentEntity).toBeInstanceOf(DeleteCommentEntity);
    expect(deleteCommentEntity.commentId).toEqual(payload.commentId);
    expect(deleteCommentEntity.threadId).toEqual(payload.threadId);
    expect(deleteCommentEntity.userId).toEqual(payload.userId);
  });

  it.each([
    {
      payload: { commentId: "c-01", threadId: "t-01", userId: "u-01" },
      description: "dengan ID singkat",
    },
    {
      payload: {
        commentId: "comment-long-id-example-12345",
        threadId: "thread-another-example-67890",
        userId: "user-super-long-id-for-testing",
      },
      description: "dengan ID yang panjang",
    },
  ])(
    "seharusnya membuat DeleteCommentEntity dengan benar $description",
    ({ payload }) => {
      const deleteCommentEntity = new DeleteCommentEntity(payload);

      expect(deleteCommentEntity).toBeInstanceOf(DeleteCommentEntity);
      expect(deleteCommentEntity.commentId).toEqual(payload.commentId);
      expect(deleteCommentEntity.threadId).toEqual(payload.threadId);
      expect(deleteCommentEntity.userId).toEqual(payload.userId);
    },
  );
});
