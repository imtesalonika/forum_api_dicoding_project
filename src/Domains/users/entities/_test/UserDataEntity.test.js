const UserDataEntity = require("../UserDataEntity");

describe("UserDataEntity", () => {
  it("seharusnya melempar error ketika payload tidak disediakan", () => {
    expect(() => new UserDataEntity(null)).toThrowError(
      "USER_DATA_ENTITY.PAYLOAD_NOT_PROVIDED",
    );
    expect(() => new UserDataEntity(undefined)).toThrowError(
      "USER_DATA_ENTITY.PAYLOAD_NOT_PROVIDED",
    );
  });

  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = { username: "dicoding", fullname: "Dicoding Indonesia" };
    const payload2 = { id: "user-123", fullname: "Dicoding Indonesia" };
    const payload3 = { id: "user-123", username: "dicoding" };
    const payload4 = { id: "user-123", username: "dicoding", fullname: null };

    expect(() => new UserDataEntity(payload1)).toThrowError(
      "USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new UserDataEntity(payload2)).toThrowError(
      "USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new UserDataEntity(payload3)).toThrowError(
      "USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new UserDataEntity(payload4)).toThrowError(
      "USER_DATA_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const base = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };
    expect(() => new UserDataEntity({ ...base, id: 123 })).toThrowError(
      "USER_DATA_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
    expect(() => new UserDataEntity({ ...base, username: true })).toThrowError(
      "USER_DATA_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
    expect(() => new UserDataEntity({ ...base, fullname: {} })).toThrowError(
      "USER_DATA_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("seharusnya melempar error ketika properti string adalah string kosong (setelah trim)", () => {
    const base = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };
    expect(() => new UserDataEntity({ ...base, id: " " })).toThrowError(
      "USER_DATA_ENTITY.PROPERTIES_CANNOT_BE_EMPTY_STRING",
    );
    expect(() => new UserDataEntity({ ...base, username: "  " })).toThrowError(
      "USER_DATA_ENTITY.PROPERTIES_CANNOT_BE_EMPTY_STRING",
    );
    expect(
      () => new UserDataEntity({ ...base, fullname: "\t\n" }),
    ).toThrowError("USER_DATA_ENTITY.PROPERTIES_CANNOT_BE_EMPTY_STRING");
  });

  it("seharusnya membuat objek UserDataEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      id: "user-xyz-789",
      username: "johndoe",
      fullname: "John Doe",
    };
    const userDataEntity = new UserDataEntity(payload);
    expect(userDataEntity).toBeInstanceOf(UserDataEntity);
    expect(userDataEntity.id).toEqual(payload.id);
    expect(userDataEntity.username).toEqual("johndoe");
    expect(userDataEntity.fullname).toEqual("John Doe");
  });

  it("seharusnya membuat objek UserDataEntity dengan benar dan melakukan trim pada username dan fullname jika diimplementasikan di constructor", () => {
    const payload = {
      id: "user-trim-test",
      username: "  janesmith  ",
      fullname: "   Jane Smith   ",
    };
    const userDataEntity = new UserDataEntity(payload);
    expect(userDataEntity.username).toEqual("janesmith");
    expect(userDataEntity.fullname).toEqual("Jane Smith");
  });

  it.each([
    {
      payload: {
        id: "user-001",
        username: "alpha_user",
        fullname: "Alpha Centauri",
      },
      deskripsi: "dengan data standar",
    },
    {
      payload: {
        id: "usr_another-id-example-with-dashes",
        username: "beta.user.test",
        fullname: "Beta User Testington Jr.",
      },
      deskripsi: "dengan ID, username, dan fullname yang lebih kompleks",
    },
  ])("seharusnya membuat UserDataEntity dengan benar", ({ payload }) => {
    const userDataEntity = new UserDataEntity(payload);
    expect(userDataEntity).toBeInstanceOf(UserDataEntity);
    expect(userDataEntity.id).toEqual(payload.id);
    expect(userDataEntity.username).toEqual(payload.username.trim());
    expect(userDataEntity.fullname).toEqual(payload.fullname.trim());
  });
});
