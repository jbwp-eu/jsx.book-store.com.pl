import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import ProductForm from "./ProductForm.jsx";

const mockNavigate = vi.fn();
const mockSubmit = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSubmit: () => mockSubmit,
    useNavigation: () => ({ state: "idle" }),
  };
});

const mockProduct = {
  title: "Test Book",
  description: "A test description",
  price: 29.99,
  countInStock: 5,
  category: "books",
  image: "https://example.com/image.jpg",
};

const renderProductForm = (product = mockProduct) => {
  const router = createMemoryRouter(
    [
      {
        path: "/admin/product/:id/edit",
        element: (
          <ProductForm method="patch" product={product} />
        ),
      },
    ],
    {
      initialEntries: ["/admin/product/123/edit"],
      initialIndex: 0,
    }
  );
  return render(<RouterProvider router={router} />);
};

describe("ProductForm", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
    mockNavigate.mockClear();
    mockSubmit.mockClear();
  });

  it("renders form with product fields and initial values", () => {
    renderProductForm();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/countInStock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Book")).toBeInTheDocument();
    expect(screen.getByDisplayValue("29.99")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation error when title is empty and touched", async () => {
    const user = userEvent.setup();
    renderProductForm();
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.tab();
    expect(await screen.findByText(/please enter title/i)).toBeInTheDocument();
  });

  it("shows validation error when description is empty and touched", async () => {
    const user = userEvent.setup();
    renderProductForm();
    const descInput = screen.getByLabelText(/description/i);
    await user.clear(descInput);
    await user.tab();
    expect(await screen.findByText(/please enter description/i)).toBeInTheDocument();
  });

  it("shows validation error when price is negative and touched", async () => {
    const user = userEvent.setup();
    renderProductForm();
    const priceInput = screen.getByLabelText(/price/i);
    await user.clear(priceInput);
    await user.type(priceInput, "-5");
    await user.tab();
    expect(await screen.findByText(/please enter a positive number/i)).toBeInTheDocument();
  });

  it("shows validation error when countInStock is negative and touched", async () => {
    const user = userEvent.setup();
    renderProductForm();
    const stockInput = screen.getByLabelText(/countInStock/i);
    await user.clear(stockInput);
    await user.type(stockInput, "-1");
    await user.tab();
    expect(await screen.findByText(/greater than or equal to 0/i)).toBeInTheDocument();
  });

  it("calls navigate with '..' when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderProductForm();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("..");
  });

  it("calls submit with FormData and patch options when form is valid and Save is clicked", async () => {
    const user = userEvent.setup();
    renderProductForm();
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const [formData, options] = mockSubmit.mock.calls[0];
    expect(options).toEqual({ method: "patch", encType: "multipart/form-data" });
    expect(formData.get("title")).toBe("Test Book");
    expect(formData.get("description")).toBe("A test description");
    expect(formData.get("price")).toBe("29.99");
    expect(formData.get("countInStock")).toBe("5");
    expect(formData.get("category")).toBe("books");
  });

  it("renders image hint and Link field when product has no image", () => {
    renderProductForm({
      title: "New",
      description: "Desc",
      price: 10,
      countInStock: 0,
      category: "books",
      image: "",
    });
    expect(screen.getByText(/please pick an image or paste the image link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link/i)).toBeInTheDocument();
  });

  it("renders with empty product without throwing", () => {
    renderProductForm({});
    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
