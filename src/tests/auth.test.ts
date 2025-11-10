import { describe, it, expect } from "vitest";
import { getAPIKey } from "../api/auth";
import { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  it("should return the API key when authorization header is valid", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc123def456",
    };

    const result = getAPIKey(headers);

    expect(result).toBe("abc123def456");
  });

  it("should return null when authorization header is missing", () => {
    const headers: IncomingHttpHeaders = {};

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return null when authorization header is undefined", () => {
    const headers: IncomingHttpHeaders = {
      authorization: undefined,
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return null when authorization header is empty string", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "",
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return null when authorization header has wrong prefix", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer abc123def456",
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return null when authorization header has wrong case", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey abc123def456",
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return null when authorization header only contains ApiKey without value", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };

    const result = getAPIKey(headers);

    expect(result).toBeNull();
  });

  it("should return empty string when authorization header has only one space", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey ",
    };

    const result = getAPIKey(headers);

    expect(result).toBe("");
  });

  it("should return empty string when there are extra spaces", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey   abc123def456",
    };

    const result = getAPIKey(headers);

    expect(result).toBe("");
  });

  it("should return the first part after ApiKey when multiple parts exist", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc123def456 extra parts",
    };

    const result = getAPIKey(headers);

    expect(result).toBe("abc123def456");
  });

  it("should handle API key with special characters", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc-123_def.456",
    };

    const result = getAPIKey(headers);

    expect(result).toBe("abc-123_def.456");
  });

  it("should handle very long API key", () => {
    const longApiKey = "a".repeat(1000);
    const headers: IncomingHttpHeaders = {
      authorization: `ApiKey ${longApiKey}`,
    };

    const result = getAPIKey(headers);

    expect(result).toBe(longApiKey);
  });

  it("should handle authorization header as string array (multiple values)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: ["ApiKey abc123", "Bearer def456"] as never,
    };

    // This test verifies the function handles arrays gracefully (should throw an error)
    expect(() => getAPIKey(headers)).toThrow();
  });
});
