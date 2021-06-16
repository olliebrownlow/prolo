import React from "react";

const ThemeButton = (props) => {
  const { onClick } = props;

  return (
    <button
      className={props.className}
      name={props.name}
      value={props.value}
      onClick={onClick}
      style={props.style}
    >
      {props.label}
    </button>
  );
};

export default ThemeButton;
