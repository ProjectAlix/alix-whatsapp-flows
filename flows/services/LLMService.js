const axios = require("axios");
class LLMService {
  constructor(api_base) {
    this.api_base = api_base;
  }
  async makeLLMRequest(requestBody, path, mockResponse = false) {
    if (mockResponse) {
      return {
        data: "mock api response",
      };
    }
    const response = await axios({
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      url: `${this.api_base}llm/${path || ""}`,
      data: requestBody,
    });
    return response;
  }
}

module.exports = {
  LLMService,
};
