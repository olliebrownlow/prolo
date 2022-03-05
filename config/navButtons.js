import React from "react";
import {
  Home,
  BookOpen,
  Pocket,
  Settings,
  TrendingUp,
} from "react-feather";

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
    label: "settings",
    path: "/settings",
    icon: <Settings />,
  },
];
export default navButtons;
