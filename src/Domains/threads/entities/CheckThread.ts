export default class CheckThread {
  threadId : string;

  constructor(payload : {threadId : string}) {
    this._verifyPayload(payload);
  
    this.threadId = payload.threadId;
  }

  private _verifyPayload(payload : {threadId : string}) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error("CHECK_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof threadId !== "string") {
      throw new Error("CHECK_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
