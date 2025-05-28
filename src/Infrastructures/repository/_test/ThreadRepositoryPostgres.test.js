const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const NewThreadEntities = require("../../../Domains/threads/entities/NewThreadEntities");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CreatedThreadEntity = require("../../../Domains/threads/entities/CreatedThreadEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  const mockIdGenerator = jest.fn(() => "qwerty");
  let threadRepositoryPostgres;

  beforeEach(() => {
    threadRepositoryPostgres = new ThreadRepositoryPostgres(
      pool,
      mockIdGenerator,
    );
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    mockIdGenerator.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("berhasil menyimpan thread baru dan mengembalikan thread yang dibuat dengan benar", async () => {
      // Arrange
      const newThread = new NewThreadEntities({
        title: "Ini adalah judul dari thread",
        body: "Ini adalah body thread",
      });
      const userId = "user-qwerty";
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "tesalonika",
        password: "secretpassword",
        fullname: "Tesalonika Aprisda Sitopu",
      });

      const createdThread = await threadRepositoryPostgres.addThread(
        newThread,
        userId,
      );

      expect(mockIdGenerator).toHaveBeenCalled();
      const threads =
        await ThreadsTableTestHelper.findThreadById("thread-qwerty");
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toBe("thread-qwerty");
      expect(threads[0].title).toBe(newThread.title);
      expect(threads[0].body).toBe(newThread.body);
      expect(threads[0].user_id).toBe(userId);

      expect(createdThread).toBeInstanceOf(CreatedThreadEntity);
      expect(createdThread.id).toBe("thread-qwerty");
      expect(createdThread.title).toBe(newThread.title);
      expect(createdThread.owner).toBe(userId);
    });
  });

  describe("isThreadExists function", () => {
    it("seharusnya tidak melemparkan error jika thread ada", async () => {
      // Arrange
      const userId = "user-isThreadExists";
      const threadId = "thread-isThreadExists-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "testerExists" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: userId,
        title: "Test Exists",
        body: "Body Exists"
      });

      await expect(threadRepositoryPostgres.isThreadExists(threadId)).resolves.not.toThrow(NotFoundError);
    });

    it("seharusnya melemparkan NotFoundError jika thread tidak ada", async () => {
      const nonExistentThreadId = "thread-xxx-nonexistent";

      await expect(threadRepositoryPostgres.isThreadExists(nonExistentThreadId)).rejects.toThrow(NotFoundError);
      await expect(threadRepositoryPostgres.isThreadExists(nonExistentThreadId)).rejects.toThrow("Tidak ada thread ditemukan pada database.");
    });
  });

  describe("getThreadById function", () => {
    it("melemparkan NotFoundError jika thread tidak ada", async () => {
      const nonExistentThreadId = "thread-xxx-nonexistent";

      await expect(
        threadRepositoryPostgres.getThreadById(nonExistentThreadId),
      ).rejects.toThrow(NotFoundError);
      await expect(
        threadRepositoryPostgres.getThreadById(nonExistentThreadId),
      ).rejects.toThrow("Detail thread tidak ditemukan");
    });

    it("seharusnya mendapatkan detail thread dengan benar", async () => {
      const threadId = "thread-qwerty-baru";
      const threadDate = new Date();
      const userId = "user-qwertyZ";
      const threadTitle = "Ini adalah judul dari thread";
      const threadBody = "Ini adalah body dari thread";
      const username = "tesalonikabaru";


      await UsersTableTestHelper.addUser({
        id: userId,
        username: username,
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: threadTitle,
        body: threadBody,
        user_id: userId,
        date: threadDate,
      });

      const threadDetails =
        await threadRepositoryPostgres.getThreadById(threadId);

      expect(threadDetails.id).toBe(threadId);
      expect(threadDetails.title).toBe(threadTitle);
      expect(threadDetails.body).toBe(threadBody);
      expect(threadDetails.date.toISOString()).toBe(threadDate.toISOString());
      expect(threadDetails.username).toBe(username);
    });
  });
});