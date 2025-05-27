const ThreadRepository = require("../ThreadRepository");
describe("Thread Repository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    const commentRepository = new ThreadRepository();

    await expect(commentRepository.getThreadById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );

    await expect(commentRepository.isThreadExists("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );

    await expect(commentRepository.addThread("", "")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
