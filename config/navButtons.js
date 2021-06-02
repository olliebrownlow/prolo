import React from "react";
import {
  Activity,
  Home,
  BarChart2,
  Loader,
  Pocket,
  Settings,
  TrendingUp,
  RefreshCw,
  PlusSquare,
  Type,
} from "react-feather";

const navButtons = [
  {
    label: "Home",
    path: "/",
    icon: <Home />,
  },
  {
    label: "Balances",
    path: "/balances",
    icon: <TrendingUp />,
  },
  {
    label: "Trades",
    path: "/trades",
    icon: <Type />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings />,
  },
];
export default navButtons;
