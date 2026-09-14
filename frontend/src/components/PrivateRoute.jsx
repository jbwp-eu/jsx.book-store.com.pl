import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const stored = localStorage.getItem("userInfo");
  const hasSession = Boolean((userInfo && userInfo.email) || stored);

  return hasSession ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default PrivateRout;
