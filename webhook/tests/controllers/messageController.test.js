const { handleMessage } = require("../../controllers/messageController");
const {
  InboundMessageHandler,
  OutboundFlowHandler,
} = require("../../handlers/MessageHandlers");

jest.mock("../../handlers/MessageHandlers", () => ({
  InboundMessageHandler: jest.fn().mockImplementation(() => ({
    handle: jest.fn(),
  })),
  OutboundFlowHandler: jest.fn().mockImplementation(() => ({
    handle: jest.fn(),
  })),
}));

describe("handleMessage", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      body: { organizationPhoneNumber: "org-phone", To: "to-phone" },
    };
    res = { send: jest.fn() };
    next = jest.fn();
  });

  it("should use OutboundFlowHandler when client-side-trigger header is present", async () => {
    req.headers["client-side-trigger"] = "true"; // Simulating client-side trigger
    await handleMessage(req, res, next);

    expect(OutboundFlowHandler).toHaveBeenCalledWith({
      req,
      res,
      organizationPhoneNumber: "org-phone",
      firestore: expect.anything(),
      clientSideTriggered: true,
      isReminder: false,
    });
    expect(InboundMessageHandler).not.toHaveBeenCalled();
  });

  it("should use InboundMessageHandler when client-side-trigger header is absent", async () => {
    await handleMessage(req, res, next);

    expect(InboundMessageHandler).toHaveBeenCalledWith({
      req,
      res,
      organizationPhoneNumber: "to-phone",
      firestore: expect.anything(),
      clientSideTriggered: false,
      isReminder: false,
    });
    expect(OutboundFlowHandler).not.toHaveBeenCalled();
  });

  it("should call next with an error if handler fails", async () => {
    const error = new Error("Handler failed");
    InboundMessageHandler.mockImplementation(() => ({
      handle: jest.fn().mockRejectedValue(error),
    }));

    await handleMessage(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
