import React from "react";
import ReactDOM from 'react-dom';


const Backdrop = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClose}></div>, document.getElementById('modal-backdrop')
  )
}

export default Backdrop;