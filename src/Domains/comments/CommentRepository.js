class CommentRepository {
  /**
   *
   * @param commentData
   * @param threadId
   * @param userId
   * @returns {Promise<AddedCommentEntity>}
   */
  async addComment(commentData, threadId, userId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   *
   * @returns {Promise<CommentEntity>}
   * @param commentId
   */
  async getComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   *
   * @param commentId
   * @param threadId
   * @param ownerId
   * @returns {Promise<boolean>}
   */
  async deleteComment(commentId, threadId, ownerId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   *
   * @param threadId
   * @returns {Promise<Object>}
   */
  async getCommentsByThreadId(threadId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

  }
}

module.exports = CommentRepository;
