const GetThreadDetailsEntity = require("../GetThreadDetailsEntity");

describe("GetThreadDetailsEntity", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = {};
    const payload2 = { threadId: null };
    const payload3 = { threadId: undefined };

    expect(() => new GetThreadDetailsEntity(payload1)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new GetThreadDetailsEntity(payload2)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new GetThreadDetailsEntity(payload3)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const payload1 = { threadId: 123 };
    const payload2 = { threadId: true };
    const payload3 = { threadId: {} };

    expect(() => new GetThreadDetailsEntity(payload1)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
    expect(() => new GetThreadDetailsEntity(payload2)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
    expect(() => new GetThreadDetailsEntity(payload3)).toThrowError(
      "GET_THREAD_DETAILS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("seharusnya membuat objek GetThreadDetailsEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      threadId: "thread-xyz-789",
    };

    const getThreadDetailsEntity = new GetThreadDetailsEntity(payload);

    expect(getThreadDetailsEntity).toBeInstanceOf(GetThreadDetailsEntity);
    expect(getThreadDetailsEntity.threadId).toEqual(payload.threadId);
  });

  it.each([
    {
      payload: { threadId: "thread-001" },
      deskripsi: "dengan ID thread standar",
    },
    {
      payload: {
        threadId: "thd-another-long-identifier-for-a-specific-thread",
      },
      deskripsi: "dengan ID thread yang panjang",
    },
    {
      payload: { threadId: "t_123_abc_xyz_789" },
      deskripsi: "dengan ID thread yang mengandung underscore",
    },
  ])(
    "seharusnya membuat GetThreadDetailsEntity dengan benar $deskripsi",
    ({ payload }) => {
      const getThreadDetailsEntity = new GetThreadDetailsEntity(payload);

      expect(getThreadDetailsEntity).toBeInstanceOf(GetThreadDetailsEntity);
      expect(getThreadDetailsEntity.threadId).toEqual(payload.threadId);
    },
  );
});
