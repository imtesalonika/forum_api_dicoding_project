const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailsUseCase = require("../../../../Applications/use_case/GetThreadDetailsUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addNewThread = this.addNewThread.bind(this);
    this.getThreadDetails = this.getThreadDetails.bind(this);
  }

  async addNewThread(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(request.payload, userId);

    const response = h.response({
      status: "success",
      data: {
        addedThread: addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetails(request, h) {
    const getThreadDetailsUseCase = this._container.getInstance(
      GetThreadDetailsUseCase.name,
    );
    const { threadId } = request.params;
    const addedThread = await getThreadDetailsUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread: addedThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;
