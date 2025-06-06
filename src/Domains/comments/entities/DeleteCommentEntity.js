class DeleteCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, threadId, userId } = payload;

    this.commentId = commentId;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload(payload) {
    const { commentId, threadId, userId } = payload;

    if (!commentId || !threadId || !userId) {
      throw new Error("DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof commentId !== "string" ||
      typeof threadId !== "string" ||
      typeof userId !== "string"
    ) {
      throw new Error("DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteCommentEntity;
