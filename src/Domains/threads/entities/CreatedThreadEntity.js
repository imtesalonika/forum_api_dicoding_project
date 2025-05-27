class CreatedThreadEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, owner } = payload;

    this.owner = owner;
    this.title = title;
    this.id = id;
  }

  _verifyPayload(payload) {
    if (
      !payload ||
      typeof payload.id === "undefined" ||
      payload.id === null ||
      typeof payload.title === "undefined" ||
      payload.title === null ||
      typeof payload.owner === "undefined" ||
      payload.owner === null
    ) {
      throw new Error("CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { id, title, owner } = payload;

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED");
    }
  }
}

module.exports = CreatedThreadEntity;
