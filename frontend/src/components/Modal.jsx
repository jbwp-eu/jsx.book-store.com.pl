import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { useContext } from "react";
import { AppContext } from "./AppProvider";

const ModalContent = (props) => {
  const { children, onClose, modalType } = props;

  const { lang } = useContext(AppContext);

  let type;

  switch (modalType) {
    case "contact":
      type = "modal-contact";
      break;
    case "map":
      type = "modal-map";
      break;
    default:
      type = "modal-contact";
  }

  const content = (
    <div className={`modal modal__animation modal__${modalType}`}>
      {children}
      <button
        className="button"
        onClick={(e) => {
          onClose();
          e.stopPropagation();
        }}
      >
        {lang === "PL" ? "Zamknij" : "Close"}
      </button>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById(type));
};

const Modal = (props) => {
  const { show } = props;

  return (
    <>
      {/* {show && <Backdrop onClose={onClose} />} */}
      {show && <Backdrop />}
      {show && <ModalContent {...props} />}
    </>
  );
};

export default Modal;
