class ThreadRepository {
  /**
   * @param {object} threadData
   * @param {string} userId
   * @returns {Promise<CreatedThreadEntity>}
   */
  async addThread(threadData, userId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {object} threadId
   * @returns {Promise<boolean>}
   */
  async isThreadExists(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   *
   * @param threadId
   * @returns {Promise<ThreadDetailEntity>}
   */
  async getThreadDetails(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
