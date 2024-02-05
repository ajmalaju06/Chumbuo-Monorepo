import React, { useEffect, useState } from "react";
import { Box, Grid, Icon, Text } from "@chakra-ui/react";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import BlogListItem from "./BlogListItem";
import { useGetAllBlogsByCategoryId } from "../../../queries/useBlogsQuery";
import useStore from "../../../provider/store/useStore";

const BlogList = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { selectedCategoryId, blogList, setBlogList } = useStore();

  const { data, mutate } = useGetAllBlogsByCategoryId();

  useEffect(() => {
    debugger;
    mutate({ categoryId: selectedCategoryId, pageNumber: pageNumber });
  }, [pageNumber]);

  useEffect(() => {
    if (data) {
      setBlogList(data);
    }
  }, [data]);

  return (
    <Box display={"flex"} flexDirection={"column"} id="blogLists">
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
        gap={6}
        flex={1}
        h="full"
      >
        {blogList?.categoryData?.map((item) => {
          return <BlogListItem blogListDetails={item} key={item._id} />;
        })}
      </Grid>

      <Box
        display={"flex"}
        mt={"4rem"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {blogList.isPrevPageAvailable && (
          <Box
            display={"flex"}
            alignItems={"center"}
            cursor={"pointer"}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <Icon as={MdKeyboardDoubleArrowLeft} />
            <Text letterSpacing={"2px"} fontSize={"10px"}>
              PREV
            </Text>
          </Box>
        )}

        {blogList.isNextPageAvailable && (
          <Box
            display={"flex"}
            alignItems={"center"}
            flex={1}
            justifyContent={"flex-end"}
            cursor={"pointer"}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <Text letterSpacing={"2px"} fontSize={"10px"}>
              NEXT
            </Text>
            <Icon as={MdKeyboardDoubleArrowRight} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(BlogList);
