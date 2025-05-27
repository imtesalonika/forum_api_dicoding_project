const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreatedThreadEntity = require("../../../Domains/threads/entities/CreatedThreadEntity");
const AddThreadUseCase = require("../AddThreadUseCase");
const NewThreadEntities = require("../../../Domains/threads/entities/NewThreadEntities");

describe("AddThreadUseCase", () => {
  it("berhasil mebambahkan thread dengan payload yang valid", async () => {
    const useCasePayload = new NewThreadEntities({
      title: "Ini Adalah Testing",
      body: "Halo ini adalah testing.",
    });

    const mockThreadRepository = new ThreadRepository();

    const mockCreatedThreadEntity = new CreatedThreadEntity({
      id: "thread-qwerty",
      title: "Ini Adalah Testing",
      owner: "user-qwerty",
    });

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThreadEntity));

    const mockAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const newThread = await mockAddThreadUseCase.execute(
      useCasePayload,
      "user-qwerty",
    );

    expect(newThread).toStrictEqual(new CreatedThreadEntity({
      id: "thread-qwerty",
      title: "Ini Adalah Testing",
      owner: "user-qwerty",
    }));
  });
});
