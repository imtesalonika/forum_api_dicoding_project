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
    it("jika thread ada maka return true", async () => {
      const threadId = "thread-qwertyz";
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: "user-123",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      const exists = await threadRepositoryPostgres.isThreadExists(threadId);

      expect(exists).toBe(true);
    });

    it("seharusnya mengembalikan false jika thread tidak ada", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      const exists = await threadRepositoryPostgres.isThreadExists("xxx");

      expect(exists).toBe(false);
    });
  });

  describe("getThreadDetails function", () => {
    it("melemparkan NotFoundError jika thread tidak ada", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      await expect(
        threadRepositoryPostgres.getThreadDetails("xxx"),
      ).rejects.toThrow(NotFoundError);
      await expect(
        threadRepositoryPostgres.getThreadDetails("xxx"),
      ).rejects.toThrow("thread tidak ditemukan");
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
        await threadRepositoryPostgres.getThreadDetails(threadId);

      expect(threadDetails).toBeInstanceOf(ThreadDetailEntity);
      expect(threadDetails.id).toBe(threadId);
      expect(threadDetails.title).toBe("Ini adalah judul dari thread");
      expect(threadDetails.body).toBe("Ini adalah body dari thread");
      expect(threadDetails.date.toISOString()).toBe(threadDate.toISOString());
      expect(threadDetails.username).toBe("tesalonikabaru");
      expect(threadDetails.comments).toEqual([]);
    });

    it("seharusnya mendapatkan detail thread dengan komentar (termasuk yang dihapus) dengan benar dan diurutkan berdasarkan tanggal", async () => {
      const userAId = "user-A";
      const userBId = "user-B";
      const threadOwnerId = "user-qwerty-owner";
      const threadId = "thread-qwerty-detail";
      const threadDate = new Date("2025-01-01T10:00:00.000Z");

      await UsersTableTestHelper.addUser({ id: userAId, username: "user_a" });
      await UsersTableTestHelper.addUser({ id: userBId, username: "user_b" });
      await UsersTableTestHelper.addUser({
        id: threadOwnerId,
        username: "owner",
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        date: threadDate,
        user_id: threadOwnerId,
      });

      const commentDate1 = new Date("2025-01-01T11:00:00.000Z");
      const commentDate2 = new Date("2025-01-01T12:00:00.000Z");
      const commentDate3 = new Date("2025-01-01T13:00:00.000Z");

      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        content: "Komentar pertama",
        date: commentDate1,
        thread_id: threadId,
        user_id: userAId,
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        content: "Komentar kedua yang dihapus",
        date: commentDate2,
        thread_id: threadId,
        user_id: userBId,
        is_delete: true,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3",
        content: "Komentar ketiga",
        date: commentDate3,
        thread_id: threadId,
        user_id: userAId,
        is_delete: false,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        mockIdGenerator(),
      );

      const threadDetails =
        await threadRepositoryPostgres.getThreadDetails(threadId);

      expect(threadDetails).toBeInstanceOf(ThreadDetailEntity);
      expect(threadDetails.id).toBe(threadId);
      expect(threadDetails.title).toBe("Ini adalah judul dari thread");
      expect(threadDetails.body).toBe("Ini adalah body dari thread");
      expect(threadDetails.date.toISOString()).toBe(threadDate.toISOString());
      expect(threadDetails.username).toBe("owner");

      expect(threadDetails.comments).toHaveLength(3);

      expect(threadDetails.comments[0].id).toBe("comment-1");
      expect(threadDetails.comments[0].username).toBe("user_a");
      expect(threadDetails.comments[0].content).toBe("Komentar pertama");
      expect(threadDetails.comments[0].date.toISOString()).toBe(
        commentDate1.toISOString(),
      );

      expect(threadDetails.comments[1].id).toBe("comment-2");
      expect(threadDetails.comments[1].username).toBe("user_b");
      expect(threadDetails.comments[1].content).toBe(
        "**komentar telah dihapus**",
      );
      expect(threadDetails.comments[1].date.toISOString()).toBe(
        commentDate2.toISOString(),
      );

      expect(threadDetails.comments[2].id).toBe("comment-3");
      expect(threadDetails.comments[2].username).toBe("user_a");
      expect(threadDetails.comments[2].content).toBe("Komentar ketiga");
      expect(threadDetails.comments[2].date.toISOString()).toBe(
        commentDate3.toISOString(),
      );
    });
  });
});
