const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const UserDataEntity = require("../../../Domains/users/entities/UserDataEntity"); // Pastikan entitas ini ada atau sesuai
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedCommentEntity = require("../../../Domains/comments/entities/AddedCommentEntity");
const AddCommentUseCase = require("../AddCommentUseCase");
const NewCommentEntity = require("../../../Domains/comments/entities/NewCommentEntity");

describe("AddCommentUseCase", () => {
  it("berhasil menambahkan comment baru dan memanggil semua repository dengan benar", async () => {
    const useCasePayload = {
      content: "Ini adalah comment yang baru untuk testing bro.",
    };
    const threadId = "thread-qwerty";
    const userId = "user-qwerty";

    const expectedAddedComment = new AddedCommentEntity({
      id: "comment-qwerty",
      content: useCasePayload.content,
      owner: userId,
    });

    const mockUserData = new UserDataEntity({
      id: userId,
      username: "tesalonika",
      fullname: "Tesalonika Aprisda Sitopu", // Atau properti lain yang relevan
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest.fn().mockImplementation();

    mockUserRepository.getUserDataById = jest.fn().mockResolvedValue(mockUserData);

    mockCommentRepository.addComment = jest.fn().mockResolvedValue(expectedAddedComment);

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    const actualAddedComment = await addCommentUseCase.execute(
      useCasePayload,
      threadId,
      userId,
    );


    expect(mockThreadRepository.isThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.isThreadExists).toHaveBeenCalledTimes(1);

    expect(mockUserRepository.getUserDataById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.getUserDataById).toHaveBeenCalledTimes(1);

    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      (new NewCommentEntity({
        content: useCasePayload.content
      })).content,
      threadId,
      userId,
    );
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);

    expect(actualAddedComment).toStrictEqual(new AddedCommentEntity({
      id: 'comment-qwerty',
      content :  'Ini adalah comment yang baru untuk testing bro.',
      owner: 'user-qwerty',
    }));
  });

});