class GetThreadDetailsEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId } = payload;
    this.threadId = threadId;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error("GET_THREAD_DETAILS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof threadId !== "string") {
      throw new Error(
        "GET_THREAD_DETAILS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
      );
    }
  }
}

module.exports = GetThreadDetailsEntity;
