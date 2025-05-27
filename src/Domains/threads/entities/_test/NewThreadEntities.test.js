const NewThreadEntities = require("../NewThreadEntities");

describe("NewThreadEntities", () => {
  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = { body: "Isi thread" };
    const payload2 = { title: "Judul Thread" };
    const payload3 = {};

    expect(() => new NewThreadEntities(payload1)).toThrowError(
      "NEW_THREAD_ENTITIES.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new NewThreadEntities(payload2)).toThrowError(
      "NEW_THREAD_ENTITIES.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new NewThreadEntities(payload3)).toThrowError(
      "NEW_THREAD_ENTITIES.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const validPayloadBase = { title: "Judul Valid", body: "Isi valid." };

    const payload1 = { ...validPayloadBase, title: 123 };
    const payload2 = { ...validPayloadBase, body: true };
    const payload3 = { title: 123, body: [] };

    expect(() => new NewThreadEntities(payload1)).toThrowError(
      "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
    expect(() => new NewThreadEntities(payload2)).toThrowError(
      "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
    expect(() => new NewThreadEntities(payload3)).toThrowError(
      "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE",
    );
  });

  it("seharusnya membuat objek NewThreadEntities dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      title: "Judul Thread untuk Pengujian",
      body: "Ini adalah isi dari thread yang sedang diuji.",
    };

    const newThreadEntities = new NewThreadEntities(payload);

    expect(newThreadEntities).toBeInstanceOf(NewThreadEntities);
    expect(newThreadEntities.title).toEqual(payload.title);
    expect(newThreadEntities.body).toEqual(payload.body);
  });

  it.each([
    {
      payload: { title: "Diskusi Pagi Ini", body: "Mari diskusikan topik A." },
      deskripsi: "dengan data standar",
    },
    {
      payload: {
        title: "Judul dengan Angka 123",
        body: "Isi dengan karakter spesial !@#$%",
      },
      deskripsi: "dengan angka dan karakter spesial",
    },
    {
      payload: {
        title: "  Judul dengan spasi   ",
        body: "   Isi dengan spasi juga  ",
      },
      deskripsi:
        "dengan spasi di awal/akhir (entitas ini tidak melakukan trim saat ini)",
    },
  ])(
    "seharusnya membuat NewThreadEntities dengan benar $deskripsi",
    ({ payload }) => {
      const newThreadEntities = new NewThreadEntities(payload);

      expect(newThreadEntities).toBeInstanceOf(NewThreadEntities);
      expect(newThreadEntities.title).toEqual(payload.title);
      expect(newThreadEntities.body).toEqual(payload.body);
    },
  );
});
