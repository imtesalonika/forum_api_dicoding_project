const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada",
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai",
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit",
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang",
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password",
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string",
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "NEW_THREAD_ENTITIES.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "payload tidak sesuai",
  ),
  "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
    "data type payload kamu tidak tepat",
  ),
  "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "data return dari database tidak tepat",
  ),
  "CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED": new InvariantError(
    "tipe data return dari database tidak tepat",
  ),
  "IS_THREAD_EXISTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "payload dari thread exist tidak tepat",
  ),
  "NEW_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "new comment tidak mengandung payload yang tepat",
  ),
  "NEW_COMMENT_ENTITY.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
    "data type payload kamu tidak tepat",
  ),
  "NEW_COMMENT_ENTITY.CANNOT_BE_EMPTY_STRING": new InvariantError(
    "comment yang kamu masukkan tidak boleh string kosong",
  ),
  "USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "data user tidak lengkap",
  ),
  "COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "data entity tidak lengkap diberikan database",
  ),
  "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "data thread detail tidak lengkap",
  ),
  "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "payload delete tidak lengkap",
  ),
  "DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tipe data dari payload delete comment tidak tepat",
  ),
  "GET_THREAD_DETAILS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "payload dari get detail thread tidak lengkap",
  ),
  "GET_THREAD_DETAILS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError(
      "tipe data dari get detail thread tidak tepat seharusnya string",
    ),
  "COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "data return database untuk get comment tidak tepat tipe datanya",
  ),
  "THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "data return dari database untuk detail thread entity tidak tepat",
  ),
};

module.exports = DomainErrorTranslator;
