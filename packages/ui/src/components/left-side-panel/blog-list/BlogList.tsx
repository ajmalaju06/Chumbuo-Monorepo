import React from "react";
import { Box, Grid, Icon, Text } from "@chakra-ui/react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import BlogListItem from "./BlogListItem";

const BlogList = () => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
        gap={6}
      >
        {[1, 1, 1, 1, 1, 1].map(() => {
          return <BlogListItem />;
        })}
      </Grid>

      <Box
        display={"flex"}
        mt={3}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Text letterSpacing={"2px"} fontSize={"xs"} cursor={"pointer"}>
          NEXT
        </Text>
        <Icon as={MdKeyboardDoubleArrowRight} cursor={"pointer"} />
      </Box>
    </Box>
  );
};

export default React.memo(BlogList);
