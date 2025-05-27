const CreatedThreadEntity = require("../CreatedThreadEntity");

describe("CreatedThreadEntity", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = { title: "Judul Thread", owner: "user-123" };
    const payload2 = { id: "thread-123", owner: "user-123" };
    const payload3 = { id: "thread-123", title: "Judul Thread" };
    const payload4 = { title: "Judul Saja" };
    const payload5 = {};

    expect(() => new CreatedThreadEntity(payload1)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new CreatedThreadEntity(payload2)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new CreatedThreadEntity(payload3)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new CreatedThreadEntity(payload4)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new CreatedThreadEntity(payload5)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const validPayloadBase = {
      id: "thread-123",
      title: "Judul Valid",
      owner: "user-123",
    };

    const payload1 = { ...validPayloadBase, id: 123 };
    const payload2 = { ...validPayloadBase, title: true };
    const payload3 = { ...validPayloadBase, owner: {} };
    const payload4 = { id: 123, title: false, owner: [] };

    expect(() => new CreatedThreadEntity(payload1)).toThrowError(
      "CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new CreatedThreadEntity(payload2)).toThrowError(
      "CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new CreatedThreadEntity(payload3)).toThrowError(
      "CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
    expect(() => new CreatedThreadEntity(payload4)).toThrowError(
      "CREATED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED",
    );
  });

  it("seharusnya membuat objek CreatedThreadEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      id: "thread-xyz-789",
      title: "Ini adalah Judul Thread yang Valid untuk Pengujian",
      owner: "user-abc-123",
    };

    const createdThreadEntity = new CreatedThreadEntity(payload);

    expect(createdThreadEntity).toBeInstanceOf(CreatedThreadEntity);
    expect(createdThreadEntity.id).toEqual(payload.id);
    expect(createdThreadEntity.title).toEqual(payload.title);
    expect(createdThreadEntity.owner).toEqual(payload.owner);
  });

  it.each([
    {
      payload: { id: "thread-001", title: "Diskusi Pagi", owner: "user-alpha" },
      deskripsi: "dengan data standar",
    },
    {
      payload: {
        id: "thd-long-identifier-string-example",
        title:
          "Sebuah Judul yang Sangat Panjang Sekali untuk Menguji Batasan Karakter Jika Ada Meskipun Entitas Ini Tidak Memvalidasinya",
        owner: "owner-with-special-chars-@!#",
      },
      deskripsi:
        "dengan ID dan judul yang panjang serta owner dengan karakter spesial",
    },
    {
      payload: {
        id: "t_123_abc",
        title: "Judul_dengan_underscore",
        owner: "u_456_def",
      },
      deskripsi: "dengan ID, judul, dan owner yang mengandung underscore",
    },
  ])(
    "seharusnya membuat CreatedThreadEntity dengan benar $deskripsi",
    ({ payload }) => {
      const createdThreadEntity = new CreatedThreadEntity(payload);

      expect(createdThreadEntity).toBeInstanceOf(CreatedThreadEntity);
      expect(createdThreadEntity.id).toEqual(payload.id);
      expect(createdThreadEntity.title).toEqual(payload.title);
      expect(createdThreadEntity.owner).toEqual(payload.owner);
    },
  );
});
