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

    await this._commentRepository.isUserIsOwnerOfComment(commentId, userId);

    const comment = await this._commentRepository.getComment(
      deleteCommentEntity.commentId,
    );

    return await this._commentRepository.deleteComment(
      comment.id,
      threadId,
      userId,
    );
  }
}

module.exports = DeleteCommentUseCase;
