const GetThreadDetailsEntity = require("../../../Domains/threads/entities/GetThreadDetailsEntity");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetailEntity = require("../../../Domains/threads/entities/ThreadDetailEntity");
const GetThreadDetailsUseCase = require("../GetThreadDetailsUseCase");
describe("GetThreadDetailsUseCase", () => {
  it("berhasil mendapatkan thread details", async () => {
    const threadId = "thread-qwerty";
    const threadDate = new Date();
    const commentDate = new Date();

    new GetThreadDetailsEntity({ threadId });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadDetails = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new ThreadDetailEntity({
          id: "thread-qwerty",
          title: "Ini adalah judul thread",
          body: "Ini adalah body dari thread",
          date: threadDate,
          username: "tesalonika",
          comments: [
            {
              id: "comments-qwerty",
              username: "kodok",
              date: commentDate,
              content: "krok krok",
            },
          ],
        }),
      ),
    );

    const mockGetThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    expect(await mockGetThreadDetailsUseCase.execute(threadId)).toStrictEqual(
      await mockThreadRepository.getThreadDetails(threadId),
    );
  });
});
