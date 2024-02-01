import React, { useEffect, useState } from "react";
import { Box, Grid, Icon, Text } from "@chakra-ui/react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import BlogListItem from "./BlogListItem";
import { useGetAllBlogs } from "../../../queries/useBlogsQuery";
import { BlogListItemProps } from "../../../model/BlogList.model";

const BlogList = () => {
  const [blogList, setBlogList] = useState<BlogListItemProps[]>([]);
  const { data } = useGetAllBlogs();

  useEffect(() => {
    if (data) {
      setBlogList(data);
    }
  }, [data]);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
        gap={6}
      >
        {blogList.map((item) => {
          return <BlogListItem blogListDetails={item} key={item._id} />;
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
