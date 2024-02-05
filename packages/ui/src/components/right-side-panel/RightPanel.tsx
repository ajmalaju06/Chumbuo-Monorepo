import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import AboutMe from "./about-me/AboutMe";
import Subscribe from "./subscribe/Subscribe";
import SocialMedia from "./social-media/SocialMedia";
import Categories from "./categories/Categories";

const RightPanel = () => {
  const CategoryResponsive = useBreakpointValue({
    base: null,
    lg: <Categories />,
  });

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
      {CategoryResponsive}
    </Box>
  );
};

export default React.memo(RightPanel);
