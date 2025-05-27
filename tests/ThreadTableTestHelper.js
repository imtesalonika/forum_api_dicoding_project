/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-qwerty",
    title = "Ini adalah judul dari thread",
    body = "Ini adalah body dari thread",
    date = new Date(),
    user_id = "user-qwerty",
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) Returning id, title, user_id",
      values: [id, title, body, date, user_id],
    };

    await pool.query(query);
  },

  async findThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadTableTestHelper;
