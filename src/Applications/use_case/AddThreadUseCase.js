const NewThreadEntities = require("../../Domains/threads/entities/NewThreadEntities");

class AddThreadUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository
    }

    async execute(payload, userId) {
        const newThreadData = new NewThreadEntities(payload);
        return await this._threadRepository.addThread(newThreadData, userId)
    }
}

module.exports = AddThreadUseCase;