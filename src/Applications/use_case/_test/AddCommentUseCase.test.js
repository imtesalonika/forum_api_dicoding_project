const NewCommentEntity = require("../../../Domains/comments/entities/NewCommentEntity");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const UserDataEntity = require("../../../Domains/users/entities/UserDataEntity");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedCommentEntity = require("../../../Domains/comments/entities/AddedCommentEntity");
const AddCommentUseCase = require("../AddCommentUseCase");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("AddCommentUseCase", () => {
  it("berhasil menambahkan comment baru", async () => {
    // mengecek apakah payload sudah benar atau tidak
    const useCasePayload = new NewCommentEntity({
      content: "Ini adalah comment yang baru untuk testing bro.",
    });

    const threadId = "thread-qwerty";
    const userId = "user-qwerty";
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    mockUserRepository.getUserDataById = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new UserDataEntity({
          id: "user-qwerty",
          username: "tesalonika",
          fullname: "Tesalonika Aprisda Sitopu",
        }),
      ),
    );

    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedCommentEntity({
          id: "comment-qwerty",
          content: "Ini adalah comment yang baru untuk testing bro.",
          owner: userId,
        }),
      ),
    );

    const mockAddCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    const newCommentData = await mockCommentRepository.addComment(
      useCasePayload,
      threadId,
      userId,
    );

    expect(
      await mockAddCommentUseCase.execute(useCasePayload, threadId, userId),
    ).toStrictEqual(newCommentData);
  });

  it("gagal menambahkan comment baru karena thread tidak ditemukan", async () => {
    // mengecek apakah payload sudah benar atau tidak
    const useCasePayload = new NewCommentEntity({
      content: "Ini adalah comment yang baru untuk testing bro.",
    });

    const threadId = "thread-qwerty";
    const userId = "user-qwerty";
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));

    mockUserRepository.getUserDataById = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new UserDataEntity({
          id: "user-qwerty",
          username: "tesalonika",
          fullname: "Tesalonika Aprisda Sitopu",
        }),
      ),
    );

    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedCommentEntity({
          id: "comment-qwerty",
          content: "Ini adalah comment yang baru untuk testing bro.",
          owner: userId,
        }),
      ),
    );

    const mockAddCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(
      mockAddCommentUseCase.execute(useCasePayload, threadId, userId),
    ).rejects.toThrowError(NotFoundError);

    await expect(
      mockAddCommentUseCase.execute(useCasePayload, threadId, userId),
    ).rejects.toThrowError("Tidak ada thread ditemukan pada database.");

    await expect(
      mockAddCommentUseCase.execute(useCasePayload, threadId, userId),
    ).rejects.toThrowError(
      new NotFoundError("Tidak ada thread ditemukan pada database."),
    );
  });
});
