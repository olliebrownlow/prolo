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
    label: "home",
    path: "/",
    icon: <Home />,
  },
  {
    label: "balances",
    path: "/balances",
    icon: <TrendingUp />,
  },
  {
    label: "pocket",
    path: "/pocket",
    icon: <Pocket />,
  },
  {
    label: "settings",
    path: "/settings",
    icon: <Settings />,
  },
];
export default navButtons;
