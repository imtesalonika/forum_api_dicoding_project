const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreatedThreadEntity = require("../../../Domains/threads/entities/CreatedThreadEntity");
const AddThreadUseCase = require("../AddThreadUseCase");
const NewThreadEntities = require("../../../Domains/threads/entities/NewThreadEntities");

describe("AddThreadUseCase", () => {
  it("berhasil menambahkan thread dengan payload yang valid dan memanggil repository dengan benar", async () => {
    const useCasePayload = {
      title: "Ini Adalah Testing",
      body: "Halo ini adalah testing.",
    };
    const ownerId = "user-qwerty";

    const mockExpectedCreatedThreadFromRepo = new CreatedThreadEntity({
      id: "thread-qwerty",
      title: useCasePayload.title,
      owner: ownerId,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest
      .fn()
      .mockResolvedValue(mockExpectedCreatedThreadFromRepo);

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const actualCreatedThread = await addThreadUseCase.execute(
      new NewThreadEntities(useCasePayload),
      ownerId,
    );

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new NewThreadEntities({
        title: "Ini Adalah Testing",
        body: "Halo ini adalah testing.",
      }),
      ownerId,
    );

    expect(actualCreatedThread).toStrictEqual(new CreatedThreadEntity({
      id: "thread-qwerty",
      title: "Ini Adalah Testing",
      owner: "user-qwerty",
    }));

    expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
  });
});