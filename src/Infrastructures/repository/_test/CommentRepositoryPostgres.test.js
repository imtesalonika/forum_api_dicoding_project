const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddedCommentEntity = require("../../../Domains/comments/entities/AddedCommentEntity");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError"); // Import AuthorizationError
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  const mockIdGenerator = jest.fn(() => "qwerty");
  let commentRepositoryPostgres;

  beforeEach(() => {
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      mockIdGenerator,
    );
    mockIdGenerator.mockClear(); // Pastikan mock direset untuk setiap tes
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    const userId = "user-test123";
    const threadId = "thread-test123";

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: userId, username: "tester" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: userId,
        title: "Judul Thread",
        body: "Isi Thread",
      });
    });

    it("berhasil menyimpan comment baru dan mengembalikan AddedCommentEntity dengan benar", async () => {
      const commentContent = "Ini adalah contoh dari komentar";

      const addedComment = await commentRepositoryPostgres.addComment(
        commentContent,
        threadId,
        userId,
      );

      expect(mockIdGenerator).toHaveBeenCalled();
      const comments =
        await CommentsTableTestHelper.getCommentById("comment-qwerty");
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe("comment-qwerty");
      expect(comments[0].content).toBe(commentContent);
      expect(comments[0].thread_id).toBe(threadId);

      expect(addedComment).toBeInstanceOf(AddedCommentEntity);
      expect(addedComment.id).toBe("comment-qwerty");
      expect(addedComment.content).toBe(commentContent);
      expect(addedComment.owner).toBe(userId);
    });
  });

  describe("getComment function", () => {
    const userId = "user-getcomment";
    const threadId = "thread-getcomment";
    const commentId = "comment-get123";

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: userId, username: "getter" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: userId,
        title: "Get Thread",
        body: "Body Get",
      });
    });

    it("seharusnya mengembalikan CommentEntity dengan benar jika comment ditemukan", async () => {
      const commentData = {
        id: commentId,
        content: "Komentar untuk diambil",
        date: new Date(),
        user_id: userId,
        thread_id: threadId,
        is_delete: false,
      };
      await CommentsTableTestHelper.addComment(commentData);

      const retrievedComment =
        await commentRepositoryPostgres.getComment(commentId);

      expect(retrievedComment).toBeInstanceOf(CommentEntity);
      expect(retrievedComment.id).toBe(commentData.id);
      expect(retrievedComment.content).toBe(commentData.content);
      expect(retrievedComment.date.toISOString()).toBe(
        commentData.date.toISOString(),
      );
      expect(retrievedComment.userId).toBe(commentData.user_id);
      expect(retrievedComment.threadId).toBe(commentData.thread_id);
      expect(retrievedComment.isDelete).toBe(commentData.is_delete);
    });

    it("seharusnya melemparkan NotFoundError jika comment tidak ditemukan", async () => {
      await expect(
        commentRepositoryPostgres.getComment("comment-nonexistent"),
      ).rejects.toThrow(NotFoundError);
      await expect(
        commentRepositoryPostgres.getComment("comment-nonexistent"),
      ).rejects.toThrow("comment not found");
    });
  });

  describe("deleteComment function", () => {
    const ownerId = "user-ownerdelete";
    const otherUserId = "user-otherdelete";
    const threadId = "thread-fordelete";
    const commentId = "comment-delete123";

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: ownerId,
        username: "ownerdelete",
      });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "otherdelete",
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: ownerId,
        title: "Delete Thread",
        body: "For Delete",
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Komentar yang akan dihapus",
        user_id: ownerId,
        thread_id: threadId,
        is_delete: false,
      });
    });

    it("seharusnya berhasil mengubah is_delete menjadi true jika comment adalah milik user", async () => {
      await commentRepositoryPostgres.deleteComment(
        commentId,
        threadId,
        ownerId,
      );

      const deletedComment =
        await CommentsTableTestHelper.getCommentById(commentId);
      expect(deletedComment).toHaveLength(1);
      expect(deletedComment[0].is_delete).toBe(true);
    });

    it("seharusnya melemparkan InvariantError jika comment tidak ditemukan atau bukan milik user", async () => {
      await expect(
        commentRepositoryPostgres.deleteComment(
          "comment-salah",
          threadId,
          ownerId,
        ),
      ).rejects.toThrow(InvariantError);
      await expect(
        commentRepositoryPostgres.deleteComment(
          "comment-salah",
          threadId,
          ownerId,
        ),
      ).rejects.toThrow("failed to delete comment");

      await expect(
        commentRepositoryPostgres.deleteComment(
          commentId,
          "thread-salah",
          ownerId,
        ),
      ).rejects.toThrow(InvariantError);

      await expect(
        commentRepositoryPostgres.deleteComment(
          commentId,
          threadId,
          otherUserId,
        ),
      ).rejects.toThrow(InvariantError);
    });
  });

  describe("getCommentsByThreadId function", () => {
    const user1Id = "user-commentsThread1";
    const user2Id = "user-commentsThread2";
    const threadId = "thread-forcomments";
    const date1 = new Date("2024-01-01T10:00:00.000Z");
    const date2 = new Date("2024-01-01T11:00:00.000Z");
    const date3 = new Date("2024-01-01T12:00:00.000Z");


    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: user1Id, username: "userkomen1" });
      await UsersTableTestHelper.addUser({ id: user2Id, username: "userkomen2" });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: user1Id,
        title: "Thread untuk Komentar",
        body: "Isi dari thread untuk komentar",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        content: "Komentar pertama",
        user_id: user1Id,
        thread_id: threadId,
        date: date1,
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        content: "Komentar kedua",
        user_id: user2Id,
        thread_id: threadId,
        date: date2,
        is_delete: true,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3",
        content: "Komentar ketiga",
        user_id: user1Id,
        thread_id: threadId,
        date: date3,
        is_delete: false,
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread-other",
        user_id: user1Id,
        title: "Thread Lain",
        body: "Isi Thread Lain",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-other",
        content: "Komentar di thread lain",
        user_id: user1Id,
        thread_id: "thread-other",
      });
    });

    it("seharusnya mengembalikan semua komentar untuk threadId tertentu dengan benar", async () => {
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(3);

      expect(comments[0].id).toBe("comment-1");
      expect(comments[0].content).toBe("Komentar pertama");
      expect(new Date(comments[0].date).toISOString()).toBe(date1.toISOString());
      expect(comments[0].username).toBe("userkomen1");
      expect(comments[0].is_delete).toBe(false);

      expect(comments[1].id).toBe("comment-2");
      expect(comments[1].content).toBe("Komentar kedua");
      expect(new Date(comments[1].date).toISOString()).toBe(date2.toISOString());
      expect(comments[1].username).toBe("userkomen2");
      expect(comments[1].is_delete).toBe(true);

      expect(comments[2].id).toBe("comment-3");
      expect(comments[2].content).toBe("Komentar ketiga");
      expect(new Date(comments[2].date).toISOString()).toBe(date3.toISOString());
      expect(comments[2].username).toBe("userkomen1");
      expect(comments[2].is_delete).toBe(false);
    });

    it("seharusnya mengembalikan array kosong jika tidak ada komentar untuk threadId tersebut", async () => {
      const comments = await commentRepositoryPostgres.getCommentsByThreadId("thread-nonexistent");
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(0);
    });

    it("seharusnya mengembalikan komentar dalam urutan tanggal ascending", async () => {
      await CommentsTableTestHelper.cleanTable();
      const dateLate = new Date("2024-01-01T15:00:00.000Z");
      const dateEarly = new Date("2024-01-01T09:00:00.000Z");
      const dateMid = new Date("2024-01-01T13:00:00.000Z");

      await CommentsTableTestHelper.addComment({
        id: "comment-late",
        content: "Komentar Terlambat",
        user_id: user1Id,
        thread_id: threadId,
        date: dateLate,
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-early",
        content: "Komentar Paling Awal",
        user_id: user2Id,
        thread_id: threadId,
        date: dateEarly,
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-mid",
        content: "Komentar Tengah",
        user_id: user1Id,
        thread_id: threadId,
        date: dateMid,
        is_delete: false,
      });

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(comments).toHaveLength(3);
      expect(comments[0].id).toBe("comment-early");
      expect(comments[1].id).toBe("comment-mid");
      expect(comments[2].id).toBe("comment-late");
      expect(new Date(comments[0].date).getTime()).toBeLessThan(new Date(comments[1].date).getTime());
      expect(new Date(comments[1].date).getTime()).toBeLessThan(new Date(comments[2].date).getTime());
    });
  });

  describe("isUserIsOwnerOfComment function", () => {
    const ownerUserId = "user-owner123";
    const otherUserId = "user-other456";
    const threadId = "thread-forownercheck";
    const commentId = "comment-ownercheck789";

    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: ownerUserId, username: "owneruser" });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: "otheruser" });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        user_id: ownerUserId, // Thread dimiliki oleh ownerUserId
        title: "Thread untuk Pengecekan Kepemilikan Komentar",
        body: "Isi thread...",
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Komentar ini milik ownerUserId",
        user_id: ownerUserId,
        thread_id: threadId,
        is_delete: false,
      });
    });

    it("seharusnya tidak melemparkan error jika user adalah pemilik comment", async () => {
      await expect(commentRepositoryPostgres.isUserIsOwnerOfComment(commentId, ownerUserId))
        .resolves.not.toThrow(NotFoundError);
    });

    it("seharusnya melemparkan AuthorizationError jika user bukan pemilik comment", async () => {
      await expect(commentRepositoryPostgres.isUserIsOwnerOfComment(commentId, otherUserId))
        .rejects.toThrow(AuthorizationError);
      await expect(commentRepositoryPostgres.isUserIsOwnerOfComment(commentId, otherUserId))
        .rejects.toThrowError(`user ${otherUserId} bukan pemilik dari comment ${commentId}`);
    });

    it("seharusnya melemparkan NotFoundError jika comment tidak ditemukan", async () => {
      const nonExistentCommentId = "comment-nonexistent";
      await expect(commentRepositoryPostgres.isUserIsOwnerOfComment(nonExistentCommentId, ownerUserId))
        .rejects.toThrow(NotFoundError);
      await expect(commentRepositoryPostgres.isUserIsOwnerOfComment(nonExistentCommentId, ownerUserId))
        .rejects.toThrowError("comment not found");
    });
  });
});