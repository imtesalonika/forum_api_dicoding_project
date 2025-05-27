const AddedCommentEntity = require("../AddedCommentEntity");

describe("AddedCommentEntity", () => {
  it("should throw error when payload does not contain needed property", () => {
    const payload1 = { id: "comment-abc-123", content: "A comment" };
    const payload2 = { id: "comment-def-456", owner: "user-xyz-789" };
    const payload3 = { content: "Another comment", owner: "user-pqr-000" };
    const payload4 = {};

    expect(() => new AddedCommentEntity(payload1)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new AddedCommentEntity(payload2)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new AddedCommentEntity(payload3)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new AddedCommentEntity(payload4)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload does not meet data type specification", () => {
    const payload1 = {
      id: 12345,
      content: "A comment",
      owner: "user-valid-id",
    };
    const payload2 = {
      id: "comment-valid-id",
      content: true,
      owner: "user-another-valid-id",
    };
    const payload3 = {
      id: "comment-super-valid",
      content: "A comment",
      owner: { id: "user-id" },
    };
    const payload4 = { id: false, content: [], owner: 999 };

    expect(() => new AddedCommentEntity(payload1)).toThrowError(
      "ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new AddedCommentEntity(payload2)).toThrowError(
      "ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new AddedCommentEntity(payload3)).toThrowError(
      "ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new AddedCommentEntity(payload4)).toThrowError(
      "ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
  });

  it("should create AddedCommentEntity object correctly when given proper payload", () => {
    const payload1 = {
      id: "comment-1",
      content: "test",
      owner: "user-001",
    };

    const payload2 = {
      id: "comment-2",
      content: "test test",
      owner: "user-002",
    };

    const payload3 = {
      id: "comment-3",
      content: "test test test",
      owner: "user-003",
    };

    const addedComment1 = new AddedCommentEntity(payload1);
    const addedComment2 = new AddedCommentEntity(payload2);
    const addedComment3 = new AddedCommentEntity(payload3);

    expect(addedComment1).toBeInstanceOf(AddedCommentEntity);
    expect(addedComment1.id).toEqual(payload1.id);
    expect(addedComment1.content).toEqual(payload1.content);
    expect(addedComment1.owner).toEqual(payload1.owner);

    expect(addedComment2).toBeInstanceOf(AddedCommentEntity);
    expect(addedComment2.id).toEqual(payload2.id);
    expect(addedComment2.content).toEqual(payload2.content);
    expect(addedComment2.owner).toEqual(payload2.owner);

    expect(addedComment3).toBeInstanceOf(AddedCommentEntity);
    expect(addedComment3.id).toEqual(payload3.id);
    expect(addedComment3.content).toEqual(payload3.content);
    expect(addedComment3.owner).toEqual(payload3.owner);
  });

  it.each([
    {
      payload: {
        id: "comment-zeta-777",
        content: "Comment from test.each 1",
        owner: "user-epsilon-888",
      },
      description: "with standard alphanumeric ID",
    },
    {
      payload: {
        id: "c-00000000-0000-0000-0000-000000000001",
        content: "Comment with UUID style ID",
        owner: "u-ffffffff-ffff-ffff-ffff-ffffffffffff",
      },
      description: "with UUID-like ID",
    },
    {
      payload: {
        id: "very_long_id_with_underscores_and_numbers_1234567890",
        content: "Comment for a very long ID",
        owner: "owner_with_similar_long_id_0987654321",
      },
      description: "with very long ID and underscores",
    },
  ])(
    "should create AddedCommentEntity correctly $description",
    ({ payload }) => {
      const addedComment = new AddedCommentEntity(payload);

      expect(addedComment).toBeInstanceOf(AddedCommentEntity);
      expect(addedComment.id).toEqual(payload.id);
      expect(addedComment.content).toEqual(payload.content);
      expect(addedComment.owner).toEqual(payload.owner);
    },
  );
});
