import React from "react";
import { Home, BookOpen, Pocket, TrendingUp, Folder } from "react-feather";

const navButtons = [
  {
    label: "home",
    path: "/",
    icon: <Home />,
  },
  {
    label: "ledger",
    path: "/ledger",
    icon: <BookOpen />,
  },
  {
    label: "pocket",
    path: "/pocket",
    icon: <Pocket />,
  },
  {
    label: "monitor",
    path: "/monitor",
    icon: <TrendingUp />,
  },
  {
    label: "portfolios",
    path: "/portfolios",
    icon: <Folder />,
  },
];
export default navButtons;
