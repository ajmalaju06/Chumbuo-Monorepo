import React from "react";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import RecentPost from "./recent-post/RecentPost";
import BlogList from "./blog-list/BlogList";
import { colors } from "../../theme/colors";
import Categories from "../right-side-panel/categories/Categories";

const LeftPanel = () => {
  const CategoryResponsive = useBreakpointValue({
    base: <Categories />,
    lg: null,
  });
  return (
    <Box
      w={{ base: "full", lg: "75%" }}
      display={"flex"}
      flexDirection={"column"}
      gap={10}
      px={{ base: "0px", lg: "1rem" }}
    >
      <RecentPost />
      {CategoryResponsive}

      <Box
        position={"relative"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Text
          w={"fit-content"}
          textAlign={"center"}
          bg={"white"}
          zIndex={1}
          fontSize={"xs"}
          color={colors.textColor}
          px={3}
          letterSpacing={"2px"}
        >
          BLOG LIST
        </Text>
        <Box
          w="full"
          h={"1px"}
          position={"absolute"}
          bg={"gray.300"}
          bottom={"8px"}
        />
      </Box>

      <BlogList />
    </Box>
  );
};

export default React.memo(LeftPanel);
