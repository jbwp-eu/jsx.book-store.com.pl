const Fallback = (props) => {

  return (
    <div className={`loading-spinner ${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default Fallback;