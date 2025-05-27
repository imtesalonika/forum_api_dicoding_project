class UserDataEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname } = payload;
    this.id = id;
    this.username = username.trim();
    this.fullname = fullname.trim();
  }

  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("USER_DATA_ENTITY.PAYLOAD_NOT_PROVIDED");
    }

    if (
      typeof payload.id === "undefined" ||
      payload.id === null ||
      typeof payload.username === "undefined" ||
      payload.username === null ||
      typeof payload.fullname === "undefined" ||
      payload.fullname === null
    ) {
      throw new Error("USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { id, username, fullname } = payload;

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof fullname !== "string"
    ) {
      throw new Error("USER_DATA_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (
      id.trim().length === 0 ||
      username.trim().length === 0 ||
      fullname.trim().length === 0
    ) {
      throw new Error("USER_DATA_ENTITY.PROPERTIES_CANNOT_BE_EMPTY_STRING");
    }
  }
}

module.exports = UserDataEntity;
