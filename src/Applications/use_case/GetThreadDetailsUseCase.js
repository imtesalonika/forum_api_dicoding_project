const GetThreadDetailsEntity = require("../../Domains/threads/entities/GetThreadDetailsEntity");

class GetThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const getThreadDetailsEntity = new GetThreadDetailsEntity({ threadId });
    return await this._threadRepository.getThreadDetails(
      getThreadDetailsEntity.threadId,
    );
  }
}

module.exports = GetThreadDetailsUseCase;
