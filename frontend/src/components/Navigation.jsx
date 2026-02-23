import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa6";
import { FaSortUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserNavDropdown from "./UserNavDropdown.jsx";
import AdminNavDropdown from "./AdminNavDropdown.jsx";
import { useContext } from "react";
import { AppContext } from "./AppProvider.jsx";
import SearchBox from "./SearchBox";
import { PL, GB } from "country-flag-icons/react/3x2";
import { uiActions } from "../slices/uiSlice.js";
import { useDispatch } from "react-redux";

const Navigation = () => {
  const cartQuantity = useSelector((state) => state.cart.itemsQuantity);

  const { userInfo } = useSelector((state) => state.auth);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { toggleUserTab, setToggleUserTab, toggleAdminTab, setToggleAdminTab } =
    useContext(AppContext);

  const handleUserToggle = () => {
    setToggleUserTab((prev) => !prev);
  };

  const handleAdminToggle = () => {
    setToggleAdminTab((prev) => !prev);
  };

  const setLanguageHandler = (language) => {
    dispatch(uiActions.setLanguage(language));
  };

  return (
    <>
      <ul className="nav-links">
        <li>
          <SearchBox />
        </li>
        <li>
          <NavLink to="/cart">
            <FaShoppingCart />
          </NavLink>
          <span className="badge">{cartQuantity}</span>
        </li>
        {!userInfo && (
          <li>
            <NavLink to="/login">
              <FaUser />
              {t("navigation.signIn")}
            </NavLink>
          </li>
        )}
        {userInfo && (
          <li className="position" onClick={handleUserToggle}>
            <div className="position__user">
              <span>{t("navigation.user")}</span>
              {userInfo.name}
              {!toggleUserTab && <FaSortDown />}
              {toggleUserTab && <FaSortUp />}
            </div>
            {toggleUserTab && (
              <UserNavDropdown onHandleUserToggle={handleUserToggle} />
            )}
          </li>
        )}
        {userInfo && userInfo.isAdmin && (
          <li className="position" onClick={handleAdminToggle}>
            <div className="position__user">
              Admin
              {!toggleAdminTab && <FaSortDown />}
              {toggleAdminTab && <FaSortUp />}
            </div>
            {toggleAdminTab && (
              <AdminNavDropdown onHandleAdminToggle={handleAdminToggle} />
            )}
          </li>
        )}
        <li>
          <PL
            title="PL"
            onClick={() => setLanguageHandler("PL")}
            className="flag"
          />
          <GB
            title="PL"
            onClick={() => setLanguageHandler("GB")}
            className="flag"
          />
        </li>
      </ul>
    </>
  );
};

export default Navigation;
