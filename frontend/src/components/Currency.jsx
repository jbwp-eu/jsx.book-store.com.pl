

const Currency = ({ children, currency, className }) => {
  return (
    <span className={`currency ${className}`}>
      {currency === 'PLN' ? '' : currency} {children} {currency === 'PLN' ? currency : ''}
    </span>
  );
}

export default Currency;