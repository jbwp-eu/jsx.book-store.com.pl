import { createContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {

  const [toggleUserTab, setToggleUserTab] = useState(false);
  const [toggleAdminTab, setToggleAdminTab] = useState(false);
  const [isPhoneScreen, setIsPhoneScreen] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(false);
  const [isDesktopScreen, setIsDesktopScreen] = useState(false);


  useEffect(() => {

    const mediaWatcherPhone = window.matchMedia('(max-width:575px)');

    const mediaWatcherTablet = window.matchMedia('(min-width:576px) and (max-width:991px)');

    const mediaWatcherDesktop = window.matchMedia('(min-width:992px)');

    setIsPhoneScreen(mediaWatcherPhone.matches);

    setIsTabletScreen(mediaWatcherTablet.matches);

    setIsDesktopScreen(mediaWatcherDesktop.matches);


    function updateIsPhoneScreen(e) {
      setIsPhoneScreen(e.matches)
    }

    function updateIsTabletScreen(e) {
      setIsTabletScreen(e.matches)
    }

    function updateIsDesktopScreen(e) {
      setIsDesktopScreen(e.matches)
    }

    if (mediaWatcherPhone.addEventListener) {
      mediaWatcherPhone.addEventListener('change', updateIsPhoneScreen)
    }

    if (mediaWatcherTablet.addEventListener) {
      mediaWatcherTablet.addEventListener('change', updateIsTabletScreen)
    }

    if (mediaWatcherDesktop.addEventListener) {
      mediaWatcherDesktop.addEventListener('change', updateIsDesktopScreen)
    }


    return function cleanup() {
      mediaWatcherPhone.removeEventListener('change', updateIsPhoneScreen);
      mediaWatcherTablet.removeEventListener('change', updateIsTabletScreen);
      mediaWatcherDesktop.removeEventListener('change', updateIsDesktopScreen)
    }
  }, [setIsDesktopScreen, setIsTabletScreen])


  return (
    <AppContext.Provider value={{
      toggleUserTab,
      setToggleUserTab,
      toggleAdminTab,
      setToggleAdminTab,
      isPhoneScreen,
      isTabletScreen,
      isDesktopScreen,
    }} >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;