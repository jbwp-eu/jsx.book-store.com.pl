import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setCredentials, logout } from "./authSlice";

const createStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setCredentials sets userInfo in state and stores userInfo in localStorage", () => {
    const store = createStore();
    const user = { id: "1", name: "Test", email: "test@example.com", isAdmin: false };

    store.dispatch(setCredentials(user));

    expect(store.getState().auth.userInfo).toEqual(user);
    expect(JSON.parse(localStorage.getItem("userInfo"))).toEqual(user);
  });

  it("logout clears userInfo and localStorage", () => {
    const store = createStore();
    const user = { id: "1", name: "Test", email: "test@example.com", isAdmin: false };
    store.dispatch(setCredentials(user));
    localStorage.setItem("token", "fake-token");

    store.dispatch(logout());

    expect(store.getState().auth.userInfo).toBeNull();
    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
