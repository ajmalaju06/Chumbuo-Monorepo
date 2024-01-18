import React, { useEffect } from "react";

import "./App.css";
import { Box, Image } from "@chakra-ui/react";
import Header from "./components/header/Header";
import useStore from "./provider/store/useStore";
import MainBanner from "./components/main-banner/MainBanner";
import BannerImage1 from "./assets/images/banner-Image-4.jpg";

function App() {
  const { setScrollPosition } = useStore();

  const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    setScrollPosition(scrollPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      userSelect={"none"}
      position={"relative"}
    >
      <Header />

      <MainBanner />

      <Box h={"50rem"} px={"3rem"} display={"flex"} mt={"3rem"} gap={10}>
        <Box w={"70%"}>
          <Box>
            <Image
              src={BannerImage1}
              alt="banner"
              h={"10rem"}
              w={"full"}
              objectFit={"cover"}
            />
          </Box>
        </Box>
        <Box w="30%">cdc</Box>
      </Box>
    </Box>
  );
}

export default React.memo(App);
