const {
  handleStatusCallback,
} = require("../../controllers/statusCallbackController");
const { DatabaseService } = require("../../services/DatabaseService");

jest.mock("../../services/DatabaseService"); // Mock DatabaseService

describe("handleStatusCallback", () => {
  let req, res, next, mockUpdateMessageStatus;

  beforeEach(() => {
    // Mock Express request, response, and next
    req = {
      body: {},
      app: { locals: { db: {} } },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();

    // Mock DatabaseService methods
    mockUpdateMessageStatus = jest.fn();
    DatabaseService.mockImplementation(() => ({
      updateMessageStatus: mockUpdateMessageStatus,
    }));
  });

  test("updates message status when status is not 'sent' or 'queued'", async () => {
    req.body = { MessageSid: "12345", MessageStatus: "failed" };

    await handleStatusCallback(req, res, next);

    expect(mockUpdateMessageStatus).toHaveBeenCalledWith("12345", "failed");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("acknowledged");
  });

  test("does not update message status when status is 'sent' or 'queued'", async () => {
    req.body = { MessageSid: "12345", MessageStatus: "sent" };

    await handleStatusCallback(req, res, next);

    expect(mockUpdateMessageStatus).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("acknowledged");
  });

  test("logs success for 'delivered' status", async () => {
    console.log = jest.fn();
    req.body = { MessageSid: "12345", MessageStatus: "delivered" };

    await handleStatusCallback(req, res, next);

    expect(console.log).toHaveBeenCalledWith("success");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("acknowledged");
  });

  test("handles missing MessageSid or MessageStatus", async () => {
    req.body = { MessageSid: "12345" }; // Missing MessageStatus

    await handleStatusCallback(req, res, next);

    expect(mockUpdateMessageStatus).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400); // Assuming the function doesn't fail
    expect(res.send).toHaveBeenCalledWith({
      error: "Missing required fields: MessageSid or MessageStatus",
    });
  });

  test("handles errors and sends a 500 response", async () => {
    const error = new Error("Test Error");
    mockUpdateMessageStatus.mockRejectedValueOnce(error);
    req.body = { MessageSid: "12345", MessageStatus: "failed" };

    await handleStatusCallback(req, res, next);

    expect(console.log).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});
