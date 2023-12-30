import React, { useEffect, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useGetAllBlogs } from "../../../queries/useBlogsQuery";
import Loading from "../../shared/Loading";
import BlogListItem from "./BlogListItem";

const BlogList = () => {
  const [blogLists, setBlogLists] = useState<BlogListState[]>([]);

  const { data: blogsData, isLoading: blogsLoading } = useGetAllBlogs();

  useEffect(() => {
    if (blogsData) {
      setBlogLists(blogsData);
    }
  }, [blogsData]);

  return (
    <Box display={"flex"} overflow={"hidden"}>
      {blogsLoading && <Loading />}
      <Grid
        w="full"
        listStyleType={"none"}
        m={0}
        gap={8}
        overflowY={"auto"}
        mt={"2rem"}
        px={2}
        pb={4}
        templateColumns="repeat(auto-fill, minmax(16rem, 1fr))"
      >
        {blogLists.map((item, index) => {
          return <BlogListItem blogItem={item} index={index} />;
        })}
      </Grid>
    </Box>
  );
};

export default React.memo(BlogList);
