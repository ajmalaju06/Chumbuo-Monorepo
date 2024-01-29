import React, { useEffect } from "react";

import "./App.css";
import { Box } from "@chakra-ui/react";
import useStore from "./provider/store/useStore";
import HomePage from "./pages/HomePage";
import { colors } from "./theme/colors";

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
      color={colors.textColor}
    >
      <HomePage />
    </Box>
  );
}

export default React.memo(App);
