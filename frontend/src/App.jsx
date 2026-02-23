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

import { loader as productsLoader } from "./pages/Home.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import { loader as productDetailLoader } from "./pages/ProductDetail.jsx";
import { loader as orderLoader } from "./pages/Order.jsx";
import { loader as myOrdersLoader } from "./pages/Profile.jsx";
import { loader as ordersLoader } from "./pages/admin/OrdersList.jsx";
import { loader as usersLoader } from "./pages/admin/UsersList.jsx";
import { loader as userLoader } from "./pages/admin/UserEdit.jsx";
import { loader as productsListLoader } from "./pages/admin/ProductsList.jsx";
import { tokenLoader } from "./utils/tokenUtils.js";

import { action as manipulateProductAction } from "./components/ProductForm.jsx";
import { action as deleteProductAction } from "./pages/admin/ProductsList.jsx";
import { action as reviewAction } from "./components/ReviewForm.jsx";
import { action as orderAction } from "./pages/PlaceOrder.jsx";
import { action as deleteOrderAction } from "./pages/admin/OrdersList.jsx";
import { action as deleteUserAction } from "./pages/admin/UsersList.jsx";
import { action as authAction } from "./pages/Authentication.jsx";
import { action as editUserAction } from "./pages/admin/UserEdit.jsx";
import { action as contactAction } from "./pages/Contact.jsx";
import { action as profileAction } from "./pages/Profile.jsx";
import { action as deliverProductAction } from "./pages/Order.jsx";

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
      action: contactAction(dispatch, language),
      children: [
        {
          index: true,
          element: <HomePage />,
          id: "products",
          loader: productsLoader(dispatch, language),
        },
        {
          path: "/page/:pageNumber",
          element: <HomePage />,
          loader: productsLoader(dispatch, language),
        },
        {
          path: "/search/:keyword",
          element: <HomePage />,
          loader: productsLoader(dispatch, language),
        },
        {
          path: "/search/:keyword/page/:pageNumber",
          element: <HomePage />,
          loader: productsLoader(dispatch, language),
        },
        {
          path: "product/:id",
          element: <ProductDetailPage />,
          loader: productDetailLoader(dispatch, language),
          action: reviewAction(dispatch, language),
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "login",
          element: <AuthenticationPage />,
          action: authAction(dispatch, language),
        },
        {
          path: "register",
          element: <RegisterPage />,
          action: authAction(dispatch, language),
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
              action: orderAction(dispatch, language),
            },
            {
              path: "order/:id",
              id: "order",
              element: <OrderPage />,
              loader: orderLoader(dispatch, language),
              action: deliverProductAction(dispatch, language),
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
              action: profileAction(dispatch, language),
              loader: myOrdersLoader(dispatch, language),
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
              loader: productDetailLoader(dispatch, language),
              action: manipulateProductAction(dispatch, language),
            },
            {
              path: "/admin/productslist",
              element: <ProductsListPage />,
              loader: productsListLoader(dispatch, language),
              action: deleteProductAction(dispatch, language),
            },
            {
              path: "/admin/productslist/:pageNumber",
              element: <ProductsListPage />,
              loader: productsListLoader(dispatch, language),
              action: deleteProductAction(dispatch, language),
            },
            {
              path: "/admin/ordersList",
              element: <OrdersListPage />,
              loader: ordersLoader(dispatch, language),
              action: deleteOrderAction(dispatch, language),
            },
            {
              path: "/admin/usersList",
              element: <UsersListPage />,
              loader: usersLoader(dispatch, language),
              action: deleteUserAction(dispatch, language),
            },
            {
              path: "/admin/user/:id/edit",
              element: <UserEditPage />,
              loader: userLoader(dispatch, language),
              action: editUserAction(dispatch, language),
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
