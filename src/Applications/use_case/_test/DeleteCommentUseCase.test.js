const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
describe("DeleteCommentUseCase", () => {
  it("berhasil menghapus comment", async () => {
    const commentId = "comment-qwerty";
    const threadId = "thread-qwerty";
    const userId = "user-qwerty";

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new CommentEntity({
          id: "comment-qwerty",
          content: "Ini adalah test comment.",
          date: new Date(),
          userId: "user-qwerty",
          threadId: "thread-qwerty",
          isDelete: false,
        }),
      ),
    );

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    expect((await mockCommentRepository.getComment(commentId)).id).toEqual(
      commentId,
    );

    const mockDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    expect(
      await mockDeleteCommentUseCase.execute(commentId, threadId, userId),
    ).toStrictEqual(
      await mockCommentRepository.deleteComment(commentId, threadId, userId),
    );
  });

  it("gagal menghapus comment ketika comment bukan miliknya", async () => {
    const commentId = "comment-qwerty";
    const threadId = "thread-qwerty";
    const reqUserId = "user-qwerty";
    const ownerId = "user-qwertyowner";

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new CommentEntity({
          id: "comment-qwerty",
          content: "Ini adalah test comment.",
          date: new Date(),
          userId: ownerId,
          threadId: "thread-qwerty",
          isDelete: false,
        }),
      ),
    );

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    expect((await mockCommentRepository.getComment(commentId)).id).toEqual(
      commentId,
    );

    const mockDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await expect(
      mockDeleteCommentUseCase.execute(commentId, threadId, reqUserId),
    ).rejects.toThrowError(AuthorizationError);

    await expect(
      mockDeleteCommentUseCase.execute(commentId, threadId, reqUserId),
    ).rejects.toThrowError(
      `user ${reqUserId} bukan pemilik dari comment ${commentId}`,
    );

    await expect(
      mockDeleteCommentUseCase.execute(commentId, threadId, reqUserId),
    ).rejects.toThrowError(
      new AuthorizationError(
        `user ${reqUserId} bukan pemilik dari comment ${commentId}`,
      ),
    );
  });
});
