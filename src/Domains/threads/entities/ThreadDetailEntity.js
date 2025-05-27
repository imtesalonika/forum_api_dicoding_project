class ThreadDetailEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, date, username, comments } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof payload.id === "undefined" ||
      payload.id === null ||
      typeof payload.title === "undefined" ||
      payload.title === null ||
      typeof payload.body === "undefined" ||
      payload.body === null ||
      typeof payload.date === "undefined" ||
      payload.date === null ||
      typeof payload.username === "undefined" ||
      payload.username === null ||
      typeof payload.comments === "undefined" ||
      payload.comments === null
    ) {
      throw new Error("THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { id, title, body, date, username, comments } = payload;

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      !(date instanceof Date) ||
      typeof username !== "string" ||
      !Array.isArray(comments)
    ) {
      throw new Error("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ThreadDetailEntity;
