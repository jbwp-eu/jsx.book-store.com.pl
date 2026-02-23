import { useSelector } from "react-redux";

import { Outlet, Navigate, useParams } from "react-router-dom";

const PrivateRout = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { id } = useParams();

  let user;

  if (
    window.location.pathname === `/order/${id}/stripe-payment-success` ||
    `/order/${id}/checkout`
  ) {
    user = localStorage.getItem("userInfo");
  } else {
    user = userInfo;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default PrivateRout;
