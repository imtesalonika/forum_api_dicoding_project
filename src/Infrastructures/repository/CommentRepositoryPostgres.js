const AddedCommentEntity = require("../../Domains/comments/entities/AddedCommentEntity");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const CommentEntity = require("../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentData, threadId, userId) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: `INSERT INTO comments (id, content, date, user_id, thread_id, is_delete) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id;`,
      values: [id, commentData, date, userId, threadId, false],
    };

    const result = await this._pool.query(query);

    return new AddedCommentEntity({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getComment(commentId) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("comment not found");
    }

    return new CommentEntity({
      id: result.rows[0].id,
      content: result.rows[0].content,
      date: result.rows[0].date,
      userId: result.rows[0].user_id,
      threadId: result.rows[0].thread_id,
      isDelete: result.rows[0].is_delete,
    });
  }

  async deleteComment(commentId, threadId, ownerId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 AND thread_id = $2 AND user_id = $3 RETURNING id",
      values: [commentId, threadId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("failed to delete comment");
    }
  }
}

module.exports = CommentRepositoryPostgres;
