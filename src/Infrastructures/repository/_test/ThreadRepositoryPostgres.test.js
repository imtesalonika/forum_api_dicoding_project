const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const NewThreadEntities = require("../../../Domains/threads/entities/NewThreadEntities");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CreatedThreadEntity = require("../../../Domains/threads/entities/CreatedThreadEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadDetailEntity = require("../../../Domains/threads/entities/ThreadDetailEntity");

describe("ThreadRepositoryPostgres", () => {
  const mockIdGenerator = jest.fn(() => "qwerty");

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("berhasil menyimpan thread baru dan mengembalikan thread yang dibuat dengan benar", async () => {
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator,
      );

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
    it("seharusnya mengembalikan false jika thread tidak ada", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      await expect(threadRepositoryPostgres.isThreadExists("xxx")).rejects.toThrow(NotFoundError);
    });
  });

  describe("getThreadDetails function", () => {
    it("melemparkan NotFoundError jika thread tidak ada", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      await expect(
        threadRepositoryPostgres.getThreadById("xxx"),
      ).rejects.toThrow(NotFoundError);
    });

    it("seharusnya mendapatkan detail thread dengan benar tanpa ada komentar", async () => {
      const threadId = "thread-qwerty-baru";
      const threadDate = new Date();
      const userId = "user-qwertyZ";

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "tesalonikabaru",
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: userId,
        date: threadDate,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadDetails =
        await threadRepositoryPostgres.getThreadById(threadId);

      expect(threadDetails.id).toBe(threadId);
      expect(threadDetails.title).toBe("Ini adalah judul dari thread");
      expect(threadDetails.body).toBe("Ini adalah body dari thread");
      expect(threadDetails.date.toISOString()).toBe(threadDate.toISOString());
      expect(threadDetails.username).toBe("tesalonikabaru");
    });
  });
});
