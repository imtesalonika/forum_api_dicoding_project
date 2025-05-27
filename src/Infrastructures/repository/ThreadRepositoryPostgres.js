const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThreadEntity = require("../../Domains/threads/entities/CreatedThreadEntity");
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

    if (result.rowCount === 0) {
      throw new NotFoundError("Tidak ada thread ditemukan pada database.");
    }
  }

  async getThreadById(threadId) { // Nama diubah dari getThreadDetails
    const query = {
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

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("Detail thread tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
