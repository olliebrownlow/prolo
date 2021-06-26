const CurrencyButton = (props) => (
  <button
    className={props.className}
    name={props.name}
    value={props.value}
    data-sign={props.sign}
    onClick={props.onClick}
    style={props.style}
  >
    {props.label}
  </button>
);

export default CurrencyButton;
