const NewCommentEntity = require("../../Domains/comments/entities/NewCommentEntity");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class AddCommentUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload, threadId, userId) {
    const newComment = new NewCommentEntity(payload);

    const isThreadExist = await this._threadRepository.isThreadExists(threadId);

    if (!isThreadExist) {
      throw new NotFoundError("Tidak ada thread ditemukan pada database.");
    }

    const userData = await this._userRepository.getUserDataById(userId);

    return this._commentRepository.addComment(
      newComment.content,
      threadId,
      userData.id,
    );
  }
}

module.exports = AddCommentUseCase;
