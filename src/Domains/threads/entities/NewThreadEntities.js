class NewThreadEntities {
    constructor(payload) {
        this._verifyPayload(payload)
        const {title, body} = payload;
        this.title = title;
        this.body = body;
    }

    _verifyPayload(payload) {
        const {title, body} = payload

        if (!title || !body) {
            throw new Error('NEW_THREAD_ENTITIES.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE');
        }
    }
}

module.exports = NewThreadEntities;