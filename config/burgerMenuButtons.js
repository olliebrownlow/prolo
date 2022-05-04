import {
  Home,
  BookOpen,
  Pocket,
  TrendingUp,
  Folder,
  Settings,
  LogOut,
  UserX,
} from "react-feather";

let size = 20;

export const burgerMenuNavButtons = [
  {
    label: "home",
    path: "/",
    icon: <Home size={size} />,
  },
  {
    label: "ledger",
    path: "/ledger",
    icon: <BookOpen size={size} />,
  },
  {
    label: "pocket",
    path: "/pocket",
    icon: <Pocket size={size} />,
  },
  {
    label: "monitor",
    path: "/monitor",
    icon: <TrendingUp size={size} />,
  },
  {
    label: "portfolios",
    path: "/portfolios",
    icon: <Folder size={size} />,
  },
  {
    label: "settings",
    path: "/settings",
    icon: <Settings size={size} />,
  },
];

export const burgerMenuDangerButtons = [
  {
    label: "logout",
    path: "/login",
    icon: <LogOut size={size} />,
  },
  {
    label: "delete account",
    path: "/login",
    icon: <UserX size={size} />,
  },
];
