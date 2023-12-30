import { BiLogoBlogger } from "react-icons/bi";
import { IoLayersOutline } from "react-icons/io5";
import { IoHome } from "react-icons/io5";

export const menuItems = [
  {
    id: "sideMenu1",
    name: "Home",
    icon: IoHome,
    path: "",
  },
  {
    id: "sideMenu2",
    name: "Categories",
    icon: IoLayersOutline,
    path: "/categories",
  },
  {
    id: "sideMenu3",
    name: "Blogs",
    icon: BiLogoBlogger,
    path: "/blogs/blog-list",
  },
];
