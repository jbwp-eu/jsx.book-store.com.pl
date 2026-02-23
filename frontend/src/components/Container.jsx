const Container = ({ children, className = "", style }) => {
  const classes = ["container", className].filter(Boolean).join(" ");
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};
export default Container;