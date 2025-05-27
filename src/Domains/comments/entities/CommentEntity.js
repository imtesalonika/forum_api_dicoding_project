const user = require("./CommentEntity");

class CommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, userId, threadId, isDelete } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.userId = userId;
    this.threadId = threadId;
    this.isDelete = isDelete;
  }

  _verifyPayload(payload) {
    const { id, content, date, userId, threadId, isDelete } = payload;

    if (
      !id ||
      !content ||
      !date ||
      !userId ||
      !threadId ||
      isDelete === null ||
      isDelete === undefined
    ) {
      throw new Error("COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof userId !== "string" ||
      typeof threadId !== "string" ||
      typeof isDelete !== "boolean" ||
      typeof date !== "object"
    ) {
      throw new Error("COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentEntity;
