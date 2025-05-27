class NewCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content } = payload;
    this.content = content;
  }

  _verifyPayload(payload) {
    if (
      !payload ||
      typeof payload.content === "undefined" ||
      payload.content === null
    ) {
      throw new Error("NEW_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { content } = payload;

    if (typeof content !== "string") {
      throw new Error("NEW_COMMENT_ENTITY.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }

    if (content.trim().length === 0) {
      throw new Error("NEW_COMMENT_ENTITY.CANNOT_BE_EMPTY_STRING");
    }
  }
}

module.exports = NewCommentEntity;
