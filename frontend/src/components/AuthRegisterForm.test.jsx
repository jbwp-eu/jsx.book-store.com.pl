import AuthRegisterForm from "./AuthRegisterForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import AppProvider from "./AppProvider";
import store from "../store";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { action as authAction } from "../pages/Authentication.jsx";
import { logout } from "../slices/authSlice";
import { vi, beforeEach } from "vitest";

const HomePlaceholder = () => <div>Home</div>;

const renderWithProviders = (route = "/login", options = {}) => {
  const { withAuthAction = false } = options;
  const routes = [
    { path: "/", element: <HomePlaceholder /> },
    {
      path: "/login",
      element: <AuthRegisterForm />,
      ...(withAuthAction && { action: authAction(store.dispatch, "en") }),
    },
    {
      path: "/register",
      element: <AuthRegisterForm />,
      ...(withAuthAction && { action: authAction(store.dispatch, "en") }),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
    initialIndex: 0,
  });
  return render(
    <Provider store={store}>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </Provider>
  );
};

describe("AuthRegisterForm component", () => {
  it("renders login form with Sign In heading", () => {
    renderWithProviders("/login");
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders register form with Sign Up heading", () => {
    renderWithProviders("/register");
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
  });

  describe("login form submission", () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      isAdmin: false,
      token: "fake-token",
      message: "Logged in",
    };

    beforeEach(() => {
      store.dispatch(logout());
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUser),
        })
      );
      Object.defineProperty(window, "location", {
        value: { pathname: "/login" },
        writable: true,
      });
    });

    it("submits login form, calls API, and updates store with userInfo", async () => {
      const user = userEvent.setup();
      renderWithProviders("/login", { withAuthAction: true });

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "1234");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(store.getState().auth.userInfo).toEqual({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin,
        });
      });
    });
  });
});