const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const DeleteCommentEntity = require("../../Domains/comments/entities/DeleteCommentEntity");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, threadId, userId) {
    const deleteCommentEntity = new DeleteCommentEntity({
      commentId,
      threadId,
      userId,
    });
    const comment = await this._commentRepository.getComment(
      deleteCommentEntity.commentId,
    );

    if (userId !== comment.userId) {
      throw new AuthorizationError(
        `user ${userId} bukan pemilik dari comment ${deleteCommentEntity.commentId}`,
      );
    }

    return await this._commentRepository.deleteComment(
      comment.id,
      threadId,
      userId,
    );
  }
}

module.exports = DeleteCommentUseCase;
