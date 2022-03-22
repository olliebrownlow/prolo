import React from "react";
import { Sun, Moon } from "react-feather";

export const currencyButtons = [
  {
    label: "eur",
    value: "euros",
    sign: "€",
  },
  {
    label: "gbp",
    value: "british sterling",
    sign: "£",
  },
  {
    label: "usd",
    value: "american dollars",
    sign: "$",
  },
];

export const themeButtons = [
  {
    theme: "dark",
    icon: <Moon size={32} />,
  },
  {
    theme: "light",
    icon: <Sun size={32} />,
  },
];
