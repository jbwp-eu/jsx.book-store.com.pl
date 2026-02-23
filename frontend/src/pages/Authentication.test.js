import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "./Authentication.jsx";
import { setCredentials } from "../slices/authSlice";
import { uiActions } from "../slices/uiSlice";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://test-api";

describe("Authentication action (login process)", () => {
  let mockDispatch;
  let mockFetch;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    Object.defineProperty(window, "location", {
      value: { pathname: "/login" },
      writable: true,
    });
    localStorage.clear();
  });

  it("dispatches pending notification, calls fetch with correct URL and body, then setCredentials and success notification on success", async () => {
    const user = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "fake-token",
      message: "Logged in",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(user),
    });

    const request = new Request("http://test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "1234" }),
    });

    const boundAction = action(mockDispatch, "en");
    await boundAction({ request });

    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showNotification({
        status: "pending",
        title: expect.any(String),
        message: expect.any(String),
      })
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/users/login?language=en`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "1234" }),
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showNotification({
        status: "success",
        title: expect.any(String),
        message: user.message,
      })
    );
    expect(localStorage.getItem("token")).toBe(user.token);
  });

  it("dispatches error notification and does not call setCredentials when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    const request = new Request("http://test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad@example.com", password: "wrong" }),
    });

    const boundAction = action(mockDispatch, "en");
    await boundAction({ request });

    expect(mockDispatch).toHaveBeenCalledWith(
      uiActions.showNotification({
        status: "error",
        title: expect.any(String),
        message: "Invalid credentials",
      })
    );
    const setCredentialsCalls = mockDispatch.mock.calls.filter(
      (call) => call[0]?.type === setCredentials.type
    );
    expect(setCredentialsCalls).toHaveLength(0);
    expect(localStorage.getItem("token")).toBeNull();
  });
});
