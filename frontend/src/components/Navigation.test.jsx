import { render, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import { Provider } from "react-redux";
import AppProvider from "./AppProvider";
import store from "../store";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <AppProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AppProvider>
    </Provider>
  );
};

describe("Navigation component", () => {

  it("renders search box", () => {
    // Arrange  
    renderWithProviders(<Navigation />);
    // Act
    const links = screen.getAllByRole("link");
    // Assert
    expect(links.length).toEqual(2); 
  });
  it("renders cart link", () => { 
    // Arrange  
    renderWithProviders(<Navigation />);
    // Act - cart link has only an icon, no text; find by href
    const cartLink = screen.getAllByRole("link").find((el) => el.getAttribute("href") === "/cart");
    // Assert
    expect(cartLink).toBeInTheDocument();
  });
  it("renders login link", () => {
    // Arrange  
    renderWithProviders(<Navigation />);
    // Act
    const loginLink = screen.getAllByRole("link").find((el) => el.getAttribute("href") === "/login");
    // Assert
    expect(loginLink).toBeInTheDocument();
  });
 
  it("renders AuthenticationPage when user is not logged in and clicks on login link", () => {
    // Arrange  
    renderWithProviders(<Navigation />);
    // Act
    const loginLink = screen.getAllByRole("link").find((el) => el.getAttribute("href") === "/login");
    // Assert
    userEvent.click(loginLink);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});