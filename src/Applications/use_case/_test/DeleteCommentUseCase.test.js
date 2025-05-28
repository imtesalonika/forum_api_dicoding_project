const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  let mockCommentRepository;
  let deleteCommentUseCase;

  const commentId = "comment-qwerty";
  const threadId = "thread-qwerty";
  const userId = "user-qwerty";

  beforeEach(() => {
    mockCommentRepository = {
      isUserIsOwnerOfComment: jest.fn(),
      getComment: jest.fn(),
      deleteComment: jest.fn(),
    };

    deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });
  });

  it("berhasil menghapus comment dan memanggil repository dengan benar", async () => {
    const mockRetrievedComment = new CommentEntity({
      id: commentId,
      content: "Ini adalah test comment.",
      date: new Date(),
      userId: userId,
      threadId: threadId,
      isDelete: false,
    });

    mockCommentRepository.isUserIsOwnerOfComment.mockResolvedValue(undefined);
    mockCommentRepository.getComment.mockResolvedValue(mockRetrievedComment);
    mockCommentRepository.isUserIsOwnerOfComment = jest.fn().mockImplementation();

    await deleteCommentUseCase.execute(commentId, threadId, userId);

    expect(mockCommentRepository.isUserIsOwnerOfComment).toHaveBeenCalledWith(
      commentId,
      userId,
    );
    expect(mockCommentRepository.isUserIsOwnerOfComment).toHaveBeenCalledTimes(1);

    expect(mockCommentRepository.getComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.getComment).toHaveBeenCalledTimes(1);

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      commentId,
      threadId,
      userId,
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledTimes(1);
  });
});