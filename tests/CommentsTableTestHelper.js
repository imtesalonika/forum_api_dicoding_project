const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-qwerty",
    content = "Ini adalah komentar",
    date = new Date(),
    user_id = "user-qwerty",
    thread_id = "thread-qwerty",
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) Returning id, content, user_id",
      values: [id, content, date, user_id, thread_id, is_delete],
    };

    await pool.query(query);
  },

  async getCommentById(commentId) {
    const query = {
      text: `SELECT id, thread_id, date, is_delete, CASE 
                      WHEN is_delete = true THEN '**komentar telah dihapus**'
                      ELSE content
                  END AS content
              FROM comments
              WHERE id = $1;`,
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
