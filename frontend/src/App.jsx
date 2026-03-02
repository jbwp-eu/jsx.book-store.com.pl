import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import CartPage from "./pages/Cart.jsx";
import AuthenticationPage from "./pages/Authentication.jsx";
import EditProductPage from "./pages/admin/EditProduct.jsx";
import RegisterPage from "./pages/Register.jsx";
import ShippingPage from "./pages/Shipping.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ProductsListPage from "./pages/admin/ProductsList.jsx";
import OrdersListPage from "./pages/admin/OrdersList.jsx";
import PaymentPage from "./pages/Payment.jsx";
import PlaceOrderPage from "./pages/PlaceOrder.jsx";
import OrderPage from "./pages/Order.jsx";
import UsersListPage from "./pages/admin/UsersList.jsx";
import UserEditPage from "./pages/admin/UserEdit.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Fallback from "./components/Fallback";
import ErrorPage from "./pages/Error";
import StripeFormPage from "./pages/StripeFormPage.jsx";
import StripeSuccessPage from "./pages/StripeSuccessPage.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import { tokenLoader } from "./utils/tokenUtils.js";
import ProductForm from "./components/ProductForm.jsx";
import ReviewForm from "./components/ReviewForm.jsx";
import ContactPage from "./pages/Contact.jsx";

function App() {
  const dispatch = useDispatch();

  const { language } = useSelector((state) => state.ui);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      hydrateFallbackElement: <Fallback asOverlay />,
      id: "root",
      loader: tokenLoader,
      action: ContactPage.action(dispatch, language),
      children: [
        {
          index: true,
          element: <HomePage />,
          id: "products",
          loader: HomePage.loader(dispatch, language),
        },
        {
          path: "/page/:pageNumber",
          element: <HomePage />,
          loader: HomePage.loader(dispatch, language),
        },
        {
          path: "/search/:keyword",
          element: <HomePage />,
          loader: HomePage.loader(dispatch, language),
        },
        {
          path: "/search/:keyword/page/:pageNumber",
          element: <HomePage />,
          loader: HomePage.loader(dispatch, language),
        },
        {
          path: "product/:id",
          element: <ProductDetailPage />,
          loader: ProductDetailPage.loader(dispatch, language),
          action: ReviewForm.action(dispatch, language),
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "login",
          element: <AuthenticationPage />,
          action: AuthenticationPage.action(dispatch, language),
        },
        {
          path: "register",
          element: <RegisterPage />,
          action: AuthenticationPage.action(dispatch, language),
        },
        {
          path: "",
          element: <PrivateRoute />,
          children: [
            {
              path: "shipping",
              element: <ShippingPage />,
            },
            {
              path: "payment",
              element: <PaymentPage />,
            },
            {
              path: "placeorder",
              element: <PlaceOrderPage />,
              action: PlaceOrderPage.action(dispatch, language),
            },
            {
              path: "order/:id",
              id: "order",
              element: <OrderPage />,
              loader: OrderPage.loader(dispatch, language),
              action: OrderPage.action(dispatch, language),
              children: [
                { path: "checkout", element: <StripeFormPage /> },
                {
                  path: "stripe-payment-success",
                  element: <StripeSuccessPage />,
                },
              ],
            },
            {
              path: "profile",
              element: <ProfilePage />,
              action: ProfilePage.action(dispatch, language),
              loader: ProfilePage.loader(dispatch, language),
            },
          ],
        },
        {
          path: "",
          element: <AdminRoute />,
          children: [
            {
              path: "/admin/product/:id/edit",
              element: <EditProductPage />,
              loader: ProductDetailPage.loader(dispatch, language),
              action: ProductForm.action(dispatch, language),
            },
            {
              path: "/admin/productslist",
              element: <ProductsListPage />,
              loader: ProductsListPage.loader(dispatch, language),
              action: ProductsListPage.action(dispatch, language),
            },
            {
              path: "/admin/productslist/:pageNumber",
              element: <ProductsListPage />,
              loader: ProductsListPage.loader(dispatch, language),
              action: ProductsListPage.action(dispatch, language),
            },
            {
              path: "/admin/ordersList",
              element: <OrdersListPage />,
              loader: OrdersListPage.loader(dispatch, language),
              action: OrdersListPage.action(dispatch, language),
            },
            {
              path: "/admin/usersList",
              element: <UsersListPage />,
              loader: UsersListPage.loader(dispatch, language),
              action: UsersListPage.action(dispatch, language),
            },
            {
              path: "/admin/user/:id/edit",
              element: <UserEditPage />,
              loader: UserEditPage.loader(dispatch, language),
              action: UserEditPage.action(dispatch, language),
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
