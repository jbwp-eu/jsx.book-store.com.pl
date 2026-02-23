
const Message = ({ children, variant }) => {
  return (
    <div className={`message message__${variant}`} >
      {children}
    </div >
  );
}

export default Message;