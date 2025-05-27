const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("DeleteCommentUseCase", () => {
  let mockCommentRepository;
  let deleteCommentUseCase;

  it("berhasil menghapus comment dan memanggil repository dengan benar", async () => {
    const commentId = "comment-qwerty";
    const threadId = "thread-qwerty";
    const userId = "user-qwerty";

    mockCommentRepository = new CommentRepository();
    deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockRetrievedComment = new CommentEntity({
      id: commentId,
      content: "Ini adalah test comment.",
      date: new Date(),
      userId: userId,
      threadId: threadId,
      isDelete: false,
    });

    mockCommentRepository.getComment = jest
      .fn()
      .mockResolvedValue(mockRetrievedComment);
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockResolvedValue(undefined);

    await deleteCommentUseCase.execute(commentId, threadId, userId);

    expect(mockCommentRepository.getComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.getComment).toHaveBeenCalledTimes(1);

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      commentId,
      threadId,
      userId,
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledTimes(1);
  });

  it("gagal menghapus comment ketika comment bukan miliknya dan melempar AuthorizationError", async () => {
    const commentId = "comment-qwerty";
    const threadId = "thread-qwerty";
    const requestingUserId = "user-attacker";
    const ownerCommentId = "user-owner";

    mockCommentRepository = new CommentRepository();
    deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const mockRetrievedComment = new CommentEntity({
      id: commentId,
      content: "Ini adalah test comment.",
      date: new Date(),
      userId: ownerCommentId,
      threadId: threadId,
      isDelete: false,
    });

    mockCommentRepository.getComment = jest
      .fn()
      .mockResolvedValue(mockRetrievedComment);
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockResolvedValue(undefined);

    await expect(
      deleteCommentUseCase.execute(commentId, threadId, requestingUserId),
    ).rejects.toThrow(AuthorizationError);

    await expect(
      deleteCommentUseCase.execute(commentId, threadId, requestingUserId),
    ).rejects.toThrow(
      `user ${requestingUserId} bukan pemilik dari comment ${commentId}`,
    );

    expect(mockCommentRepository.getComment).toHaveBeenCalledWith(commentId);

    expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
  });
});