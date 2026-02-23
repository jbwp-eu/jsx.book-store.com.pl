import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import AppProvider from "./AppProvider";
import store from "../store";
import Header from "./Header";

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <AppProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AppProvider>
    </Provider>
  );
};

describe("Header component", () => {
  it("renders header with BookStore title", () => {
    renderWithProviders(<Header />);
    const heading = screen.getByRole("heading", { name: /BookStore/i });
    expect(heading).toBeInTheDocument();
  });
  it ("renders navigation component", () => {
    // Arrange  
    renderWithProviders(<Header />);
    // Act
    const navigation = screen.getByRole("navigation");
    // Assert
    expect(navigation).toBeInTheDocument();
  });
 
 });
