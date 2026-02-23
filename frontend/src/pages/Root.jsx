import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Container from "../components/Container";
import Footer from "../components/Footer";
import { useNavigation } from "react-router-dom";
import Fallback from "../components/Fallback";
import Notification from "../components/Notification";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { uiActions } from "../slices/uiSlice";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { AppContext } from "../components/AppProvider";
import { useLoaderData } from "react-router-dom";
import { logout } from "../slices/authSlice.js";
import { getTokenDuration } from "../utils/tokenUtils.js";
import { Suspense } from "react";
import i18n, { appLangToI18n } from "../i18n.js";

const RootLayout = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const token = useLoaderData();

  useEffect(() => {
    i18n.changeLanguage(appLangToI18n(language));
  }, [language]);

  useEffect(() => {
    if (!token) {
      return;
    }
    if (token === "EXPIRED") {
      dispatch(logout());
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      dispatch(logout());
    }, tokenDuration);
  }, [token, dispatch]);

  const navigation = useNavigation();

  let notification = useSelector((state) => state.ui.notification);

  const { setToggleUserTab, setToggleAdminTab, toggleUserTab, toggleAdminTab } =
    useContext(AppContext);

  useEffect(() => {
    function hideNotification() {
      dispatch(uiActions.showNotification(null));
    }

    setTimeout(hideNotification, 3500);
  }, [notification, dispatch]);

  const handleAdminUserToggle = () => {
    if (toggleAdminTab) {
      setToggleAdminTab(false);
    }
    if (toggleUserTab) setToggleUserTab(false);
  };

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}

      <Header />
      <main onMouseEnter={handleAdminUserToggle}>
        {navigation.state === "loading" && <Fallback asOverlay />}
        <Container>
          <Suspense fallback={<Fallback asOverlay />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
