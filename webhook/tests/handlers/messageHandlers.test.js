const { InboundMessageHandler } = require("../../handlers/MessageHandlers");

process.env.QUEUE_LOCATION = "your-location";
process.env.PROJECT_ID = "your-project-id";

jest.mock("@google-cloud/tasks", () => {
  return {
    CloudTasksClient: jest.fn().mockImplementation(() => {
      return {
        queuePath: jest.fn(() => "mockedQueuePath"),
      };
    }),
  };
});

jest.mock("../../helpers/cloud_tasks.helpers", () => {
  return {
    createTranscriptionTask: jest.fn(),
  };
});
// Mock dependencies
jest.mock("../../services/PostRequestService");
jest.mock("../../services/DatabaseService");
jest.mock("../../services/FlowManagerService");

describe("InboundMessageHandler", () => {
  let mockReq,
    mockRes,
    mockFirestore,
    mockOrganizationPhoneNumber,
    mockClientSideTriggered,
    mockIsReminder;
  let inboundMessageHandler;

  beforeEach(() => {
    // Mock request and response objects
    mockReq = {
      body: { ButtonPayload: "payload", Body: "Test Message" },
      app: { locals: { db: {} } },
    };
    mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    mockFirestore = {}; // Mock Firestore instance
    mockOrganizationPhoneNumber = "1234567890";
    mockClientSideTriggered = false;
    mockIsReminder = false;

    // Instantiate the InboundMessageHandler
    inboundMessageHandler = new InboundMessageHandler({
      req: mockReq,
      res: mockRes,
      organizationPhoneNumber: mockOrganizationPhoneNumber,
      firestore: mockFirestore,
      clientSideTriggered: mockClientSideTriggered,
      isReminder: mockIsReminder,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it("should call the base class constructor with correct params", () => {
    expect(inboundMessageHandler.organizationPhoneNumber).toBe(
      mockOrganizationPhoneNumber
    );
    expect(inboundMessageHandler.firestore).toBe(mockFirestore);
    expect(inboundMessageHandler.clientSideTriggered).toBe(
      mockClientSideTriggered
    );
    expect(inboundMessageHandler.isReminder).toBe(mockIsReminder);
  });
});
