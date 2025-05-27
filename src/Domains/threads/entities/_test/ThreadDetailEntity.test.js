const ThreadDetailEntity = require("../ThreadDetailEntity");

describe("ThreadDetailEntity", () => {
  const validDate = new Date();
  const validComments = [
    {
      id: "comment-1",
      content: "Komentar 1",
      username: "userA",
      date: new Date(),
    },
    {
      id: "comment-2",
      content: "Komentar 2",
      username: "userB",
      date: new Date(),
    },
  ];

  it("seharusnya melempar error ketika payload tidak mengandung properti yang dibutuhkan", () => {
    const payload1 = {
      title: "Judul",
      body: "Isi",
      date: validDate,
      username: "user",
      comments: validComments,
    };
    const payload2 = {
      id: "thread-1",
      body: "Isi",
      date: validDate,
      username: "user",
      comments: validComments,
    };
    const payload3 = {
      id: "thread-1",
      title: "Judul",
      date: validDate,
      username: "user",
      comments: validComments,
    };
    const payload4 = {
      id: "thread-1",
      title: "Judul",
      body: "Isi",
      username: "user",
      comments: validComments,
    };
    const payload5 = {
      id: "thread-1",
      title: "Judul",
      body: "Isi",
      date: validDate,
      comments: validComments,
    };
    const payload6 = {
      id: "thread-1",
      title: "Judul",
      body: "Isi",
      date: validDate,
      username: "user",
    };

    expect(() => new ThreadDetailEntity(payload1)).toThrowError(
      "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new ThreadDetailEntity(payload2)).toThrowError(
      "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new ThreadDetailEntity(payload3)).toThrowError(
      "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new ThreadDetailEntity(payload4)).toThrowError(
      "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    expect(() => new ThreadDetailEntity(payload5)).toThrowError(
      "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
    );
    if (typeof payload6.comments === "undefined") {
      expect(() => new ThreadDetailEntity(payload6)).toThrowError(
        "THREAD_DETAIL_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY",
      );
    }
  });

  it("seharusnya melempar error ketika payload tidak memenuhi spesifikasi tipe data", () => {
    const basePayload = {
      id: "thread-1",
      title: "Judul",
      body: "Isi",
      date: validDate,
      username: "user",
      comments: validComments,
    };

    expect(
      () => new ThreadDetailEntity({ ...basePayload, id: 123 }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new ThreadDetailEntity({ ...basePayload, title: 123 }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new ThreadDetailEntity({ ...basePayload, body: 123 }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new ThreadDetailEntity({ ...basePayload, date: "2023-10-27" }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () => new ThreadDetailEntity({ ...basePayload, username: 123 }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(
      () =>
        new ThreadDetailEntity({
          ...basePayload,
          comments: "bukan array atau objek",
        }),
    ).toThrowError("THREAD_DETAIL_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("seharusnya membuat objek ThreadDetailEntity dengan benar ketika diberi payload yang sesuai", () => {
    const payload = {
      id: "thread-xyz-789",
      title: "Judul Thread Detail Valid",
      body: "Isi dari thread detail yang sedang diuji.",
      date: validDate,
      username: "userValid",
      comments: validComments,
    };

    const threadDetailEntity = new ThreadDetailEntity(payload);

    expect(threadDetailEntity).toBeInstanceOf(ThreadDetailEntity);
    expect(threadDetailEntity.id).toEqual(payload.id);
    expect(threadDetailEntity.title).toEqual(payload.title);
    expect(threadDetailEntity.body).toEqual(payload.body);
    expect(threadDetailEntity.date).toEqual(payload.date);
    expect(threadDetailEntity.username).toEqual(payload.username);
    expect(threadDetailEntity.comments).toEqual(payload.comments);
    expect(Array.isArray(threadDetailEntity.comments)).toBe(true);
  });

  it("seharusnya membuat objek ThreadDetailEntity dengan benar meskipun comments adalah array kosong", () => {
    const payload = {
      id: "thread-empty-comments",
      title: "Thread Tanpa Komentar",
      body: "Isi thread ini tidak memiliki komentar.",
      date: validDate,
      username: "userNoComments",
      comments: [], // Array komentar kosong
    };

    const threadDetailEntity = new ThreadDetailEntity(payload);

    expect(threadDetailEntity).toBeInstanceOf(ThreadDetailEntity);
    expect(threadDetailEntity.id).toEqual(payload.id);
    expect(threadDetailEntity.title).toEqual(payload.title);
    expect(threadDetailEntity.body).toEqual(payload.body);
    expect(threadDetailEntity.date).toEqual(payload.date);
    expect(threadDetailEntity.username).toEqual(payload.username);
    expect(threadDetailEntity.comments).toEqual([]);
    expect(Array.isArray(threadDetailEntity.comments)).toBe(true);
  });
});
