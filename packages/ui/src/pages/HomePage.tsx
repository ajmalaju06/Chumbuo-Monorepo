import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "../components/header/Header";
import MainBanner from "../components/main-banner/MainBanner";

import LeftPanel from "../components/left-side-panel/LeftPanel";
import RightPanel from "../components/right-side-panel/RightPanel";

const HomePage = () => {
  return (
    <Box h="full">
      <Header />
      <MainBanner />

      <Box
        px={{ base: "1.5rem", lg: "3rem" }}
        display={"flex"}
        mt={"3rem"}
        gap={10}
        flexDirection={{ base: "column", lg: "row" }}
      >
        <LeftPanel />
        <RightPanel />
      </Box>
    </Box>
  );
};

export default HomePage;
