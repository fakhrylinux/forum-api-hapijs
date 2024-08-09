const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(ownerId, threadId, commentId, replyId) {
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyCommentIsExist(commentId);

    const verifyReplyOwner = await this._replyRepository.verifyReplyOwner(ownerId, replyId);

    if (verifyReplyOwner.length === 0) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (verifyReplyOwner[0].owner !== ownerId) {
      throw new AuthorizationError('tidak berhak menghapus balasan');
    }

    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
