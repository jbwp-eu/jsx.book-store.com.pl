import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import AppProvider from "../../components/AppProvider.jsx";
import store from "../../store.js";
import ProductsListPage from "./ProductsList.jsx";

const mockProducts = [
  {
    _id: "1",
    title: "Test Book",
    category: "books",
    price: 29.99,
    countInStock: 5,
  },
];

const mockLoader = () => Promise.resolve({ products: mockProducts, pages: 1 });

const renderProductsList = (loader = mockLoader) => {
  const router = createMemoryRouter(
    [
      {
        path: "/admin/productslist",
        element: <ProductsListPage />,
        loader,
      },
    ],
    { initialEntries: ["/admin/productslist"], initialIndex: 0 }
  );
  return render(
    <Provider store={store}>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </Provider>
  );
};

describe("ProductsList page", () => {
  beforeEach(() => {
    vi.stubGlobal("confirm", vi.fn(() => false));
  });

  it("renders products list heading and product when products are loaded", async () => {
    renderProductsList();
    expect(await screen.findByRole("heading", { name: /products/i })).toBeInTheDocument();
    expect(await screen.findByText("Test Book")).toBeInTheDocument();
  });

  it("renders no products message when products array is empty", async () => {
    const emptyLoader = () => Promise.resolve({ products: [], pages: 0 });
    renderProductsList(emptyLoader);
    expect(await screen.findByText(/there are not any products/i)).toBeInTheDocument();
  });
});
