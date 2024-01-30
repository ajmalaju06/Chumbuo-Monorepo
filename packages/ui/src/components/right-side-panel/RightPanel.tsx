import React from "react";
import { Box } from "@chakra-ui/react";
import AboutMe from "./about-me/AboutMe";
import Subscribe from "./subscribe/Subscribe";
import SocialMedia from "./social-media/SocialMedia";
import Categories from "./categories/Categories";

const RightPanel = () => {
  return (
    <Box
      w={{ base: "full", lg: "25%" }}
      display={"flex"}
      flexDirection={"column"}
      gap={"2.5rem"}
    >
      <AboutMe />
      <Subscribe />
      <SocialMedia />
      <Categories />
    </Box>
  );
};

export default React.memo(RightPanel);
