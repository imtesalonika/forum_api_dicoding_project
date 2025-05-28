const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadDetailEntity = require("../../../Domains/threads/entities/ThreadDetailEntity");
const GetThreadDetailsUseCase = require("../GetThreadDetailsUseCase");

describe("GetThreadDetailsUseCase", () => {
  it("berhasil mendapatkan detail thread dan memanggil repository dengan benar", async () => {
    const threadId = "thread-qwerty";
    const threadDate = new Date("2024-01-15T10:00:00.000Z");
    const commentDate = new Date("2024-01-15T11:00:00.000Z");

    const mockThreadFromRepo = {
      id: threadId,
      title: "Ini adalah judul thread",
      body: "Ini adalah body dari thread",
      date: threadDate,
      username: "tesalonika",
    };

    const mockRawCommentsFromRepo = [
      {
        id: "comments-qwerty",
        username: "kodok",
        date: commentDate,
        content: "krok krok",
        is_delete: false,
      },
      {
        id: "comments-xyz",
        username: "kucing",
        date: new Date("2024-01-15T11:05:00.000Z"),
        content: "meow (dihapus)",
        is_delete: true,
      },
    ];

    const mockProcessedComments = [
      {
        id: "comments-qwerty",
        username: "kodok",
        date: commentDate,
        content: "krok krok",
      },
      {
        id: "comments-xyz",
        username: "kucing",
        date: new Date("2024-01-15T11:05:00.000Z"),
        content: "**komentar telah dihapus**",
      },
    ];

    const expectedThreadDetailEntity = new ThreadDetailEntity({
      id: mockThreadFromRepo.id,
      title: mockThreadFromRepo.title,
      body: mockThreadFromRepo.body,
      date: mockThreadFromRepo.date,
      username: mockThreadFromRepo.username,
      comments: mockProcessedComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExists = jest.fn().mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadFromRepo);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockRawCommentsFromRepo);

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const actualThreadDetails = await getThreadDetailsUseCase.execute(threadId);

    expect(mockThreadRepository.isThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);

    expect(actualThreadDetails).toStrictEqual(expectedThreadDetailEntity);

    expect(mockThreadRepository.isThreadExists).toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledTimes(1);
  });
});