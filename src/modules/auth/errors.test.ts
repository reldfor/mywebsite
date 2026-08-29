import { describe, expect, it } from "vitest";
import {
  clerkCodeToMessage,
  clerkErrorsMessage,
  clerkErrorToMessage,
  clerkFieldMessage,
  clerkGlobalMessage,
} from "@/modules/auth/errors";

describe("clerkCodeToMessage", () => {
  it("maps known codes to friendly messages", () => {
    expect(clerkCodeToMessage("form_identifier_not_found")).toMatch(/No account found/);
    expect(clerkCodeToMessage("form_password_incorrect")).toMatch(/Incorrect email or password/);
    expect(clerkCodeToMessage("form_email_address_exists")).toMatch(/already exists/);
    expect(clerkCodeToMessage("form_code_incorrect")).toMatch(/isn't right/);
    expect(clerkCodeToMessage("too_many_requests")).toMatch(/Too many attempts/);
    expect(clerkCodeToMessage("oauth_access_denied")).toMatch(/didn't grant access/);
  });

  it("returns undefined for unknown codes", () => {
    expect(clerkCodeToMessage("some_unknown_code")).toBeUndefined();
  });
});

describe("clerkErrorToMessage", () => {
  it("uses the mapped code message when known", () => {
    expect(
      clerkErrorToMessage({ code: "form_password_pwned", message: "raw developer text" })
    ).toMatch(/data breach/);
  });

  it("falls back to longMessage when the code is unknown", () => {
    expect(
      clerkErrorToMessage({ code: "mystery_code", longMessage: "User-friendly fallback" })
    ).toBe("User-friendly fallback");
  });

  it("falls back to message when nothing else is available", () => {
    expect(clerkErrorToMessage({ code: "mystery_code", message: "raw text" })).toBe("raw text");
  });

  it("never exposes developer messages for known codes", () => {
    const raw = "Internal Clerk API failure with stack details";
    const message = clerkErrorToMessage({ code: "form_password_incorrect", message: raw });
    expect(message).not.toContain("Internal Clerk API");
  });

  it("returns undefined for null or empty input", () => {
    expect(clerkErrorToMessage(null)).toBeUndefined();
    expect(clerkErrorToMessage(undefined)).toBeUndefined();
  });
});

describe("clerkFieldMessage", () => {
  it("returns the mapped message for a matching field", () => {
    const errors = {
      fields: { password: { code: "form_password_incorrect", message: "raw" } },
      global: null,
      raw: null,
    };
    expect(clerkFieldMessage(errors, "password")).toMatch(/Incorrect email or password/);
  });

  it("returns undefined when the field has no error", () => {
    const errors = { fields: { identifier: null }, global: null, raw: null };
    expect(clerkFieldMessage(errors, "password")).toBeUndefined();
  });
});

describe("clerkGlobalMessage", () => {
  it("maps the first global error", () => {
    const errors = { fields: {}, global: [{ code: "too_many_requests", message: "raw" }], raw: null };
    expect(clerkGlobalMessage(errors)).toMatch(/Too many attempts/);
  });

  it("returns undefined when there are no global errors", () => {
    expect(clerkGlobalMessage({ fields: {}, global: null, raw: null })).toBeUndefined();
  });
});

describe("clerkErrorsMessage", () => {
  it("prefers field errors over global errors in the given order", () => {
    const errors = {
      fields: { identifier: { code: "form_identifier_not_found", message: "raw" } },
      global: [{ code: "too_many_requests", message: "raw" }],
      raw: null,
    };
    expect(clerkErrorsMessage(errors, ["identifier", "password"])).toMatch(/No account found/);
  });

  it("falls back to the global error when no field matches", () => {
    const errors = {
      fields: { password: null },
      global: [{ code: "too_many_requests", message: "raw" }],
      raw: null,
    };
    expect(clerkErrorsMessage(errors, ["identifier", "password"])).toMatch(/Too many attempts/);
  });
});
