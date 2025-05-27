const GetThreadDetailsEntity = require("../../Domains/threads/entities/GetThreadDetailsEntity");
const ThreadDetailEntity = require("../../Domains/threads/entities/ThreadDetailEntity");

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    new GetThreadDetailsEntity({ threadId: threadId });
    await this._threadRepository.isThreadExists(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);

    const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);

    const processedComments = rawComments.map(comment => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,

    }));

    return new ThreadDetailEntity({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: processedComments,
    });
  }
}

module.exports = GetThreadDetailsUseCase;
