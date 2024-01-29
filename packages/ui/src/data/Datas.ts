import Banner1Img from "../assets/images/banner-Image-1.jpg";
import Banner2Img from "../assets/images/banner-Image-2.jpg";
import Banner3Img from "../assets/images/banner-Image-3.jpg";
import Banner4Img from "../assets/images/banner-Image-4.jpg";
import Banner5Img from "../assets/images/banner-Image-5.jpg";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";

export const headerMenuItems = [
  {
    id: "headerMenu1",
    name: "Home",
    path: "",
  },
  {
    id: "headerMenu2",
    name: "Blogs",
    path: "/categories",
  },
  {
    id: "headerMenu3",
    name: "Contact",
    path: "/blogs/blog-list",
  },
  {
    id: "headerMenu4",
    name: "About Me",
    path: "/blogs/blog-list",
  },
];

export const mainBannerList = [
  {
    id: "banner1",
    name: "THE VALLEY BY EMAAR",
    date: "July 22, 2015",
    image: Banner1Img,
  },
  {
    id: "banner2",
    name: "RASHID YACHTS & MARINA BY EMAAR",
    date: "July 22, 2015",
    image: Banner2Img,
  },
  {
    id: "banner3",
    name: "PARKSIDE VIEWS BY EMAAR",
    date: "July 22, 2015",
    image: Banner3Img,
  },
  {
    id: "banner4",
    name: "THE OASIS BY EMAAR",
    date: "July 22, 2015",
    image: Banner4Img,
  },
  {
    id: "banner5",
    name: "CREEK HARBOUR BY EMAAR",
    date: "July 22, 2015",
    image: Banner5Img,
  },
];

export const socialMedia = [
  {
    id: "social1",
    name: "FaceBook",
    icon: FaFacebookF,
    link: "https://www.facebook.com/",
  },
  {
    id: "social2",
    name: "Twitter",
    icon: FaXTwitter,
    link: "https://twitter.com/?lang=en",
  },
  {
    id: "social3",
    name: "Pintrest",
    icon: FaPinterest,
    link: "https://in.pinterest.com/",
  },
  {
    id: "social4",
    name: "Instagram",
    icon: BsInstagram,
    link: "https://www.instagram.com/",
  },
];
