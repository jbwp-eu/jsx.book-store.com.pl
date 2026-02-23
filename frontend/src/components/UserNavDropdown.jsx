import { Link } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const UserNavDropdown = ({ onHandleUserToggle }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className="dropdown" onMouseLeave={onHandleUserToggle}>
      <span onClick={logoutHandler}>LogOut</span>
      <Link to="/profile">{t("userNavDropdown.profile")}</Link>
    </div>
  );
};

export default UserNavDropdown;
