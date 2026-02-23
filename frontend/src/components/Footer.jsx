import Container from "./Container";
import { useState } from "react";
import Modal from "./Modal.jsx";
import Contact from "../pages/Contact.jsx";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DollarSign, ShoppingBag, WalletCards, Mail } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  const [showContact, setShowContact] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Modal
        onClose={() => setShowContact(false)}
        show={showContact}
        modalType="contact"
      >
        <Contact onClose={setShowContact} />
      </Modal>
      <Container>
        <nav>
          <ul className="footerList">
            <li>
              <button onClick={() => setShowContact(true)} className="button">
                <Mail color="white" />
                <p>
                  {t("footer.contactForm")}
                </p>
              </button>
            </li>
            <li>
              <ShoppingBag color="white" />

              <p>{t("footer.freeShipping")}</p>
              <p>{t("footer.freeShippingDesc")}</p>
            </li>
            <li>
              <DollarSign color="white" />

              <p>{t("footer.moneyBack")}</p>
              <p>{t("footer.moneyBackDesc")}</p>
            </li>
            <li>
              <WalletCards color="white" />

              <p>{t("footer.flexiblePayment")}</p>
              <p>{t("footer.flexiblePaymentDesc")}</p>
            </li>
          </ul>
        </nav>
        <div className="rights">
          {currentYear}
          {import.meta.env.VITE_APP_NAME}. All Rights Reserved
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
