const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThreadEntity = require("../../Domains/threads/entities/CreatedThreadEntity");
const ThreadDetailEntity = require("../../Domains/threads/entities/ThreadDetailEntity");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(threadData, userId) {
    const { title, body } = threadData;
    const id = `thread-${this._idGenerator()}`;
    const time = new Date();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) Returning id, title, user_id",
      values: [id, title, body, time, userId],
    };

    const result = await this._pool.query(query);

    return new CreatedThreadEntity({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].user_id,
    });
  }

  async isThreadExists(threadId) {
    const query = {
      text: "SELECT 1 FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async getThreadDetails(threadId) {
    const threadQuery = {
      text: `
      SELECT
        t.id,
        t.title,
        t.body,
        t.date,
        u.username  
      FROM
        threads t
      JOIN
        users u ON t.user_id = u.id
      WHERE
        t.id = $1
    `,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (threadResult.rows.length === 0) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    const threadData = threadResult.rows[0];

    const commentQuery = {
      text: `
        SELECT
          c.id,
          CASE
            WHEN c.is_delete = TRUE THEN '**komentar telah dihapus**'
            ELSE c.content
            END AS content, 
          c.date,
          u.username
        FROM
          comments c
            JOIN
          users u ON c.user_id = u.id
        WHERE
          c.thread_id = $1
        ORDER BY
          c.date ASC
    `,
      values: [threadId],
    };

    const commentResult = await this._pool.query(commentQuery);

    return new ThreadDetailEntity({
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.date,
      username: threadData.username,
      comments: commentResult.rows,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
