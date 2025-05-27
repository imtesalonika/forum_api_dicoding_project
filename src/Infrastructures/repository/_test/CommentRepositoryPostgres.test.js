const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper"); // Sesuaikan path
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper"); // Sesuaikan path
const pool = require("../../database/postgres/pool"); // Sesuaikan path
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres"); // Sesuaikan path
const AddedCommentEntity = require("../../../Domains/comments/entities/AddedCommentEntity"); // Sesuaikan path
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity"); // Sesuaikan path
const NotFoundError = require("../../../Commons/exceptions/NotFoundError"); // Sesuaikan path
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const { content } = require("@hapi/hapi/lib/headers");
const { use } = require("bcrypt/promises"); // Sesuaikan path

describe("CommentRepositoryPostgres", () => {
  // Mock idGenerator
  const mockIdGenerator = jest.fn(() => "qwerty");
  let commentRepositoryPostgres;

  beforeEach(() => {
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      mockIdGenerator,
    );
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
});
