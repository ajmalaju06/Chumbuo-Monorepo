import { Box, GridItem, Image, Text } from "@chakra-ui/react";
import React from "react";
import { ROUTER_ENUM } from "../../../model/router.enum";
import { useNavigate } from "react-router-dom";
import BlogImage from "../../../assets/images/blog-image.jpeg";
import { colors } from "../../../theme/colors";
import DOMPurify from "dompurify";

interface BlogListItemProps {
  blogItem: BlogListState;
  index: number;
}

const BlogListItem: React.FC<BlogListItemProps> = ({ blogItem, index }) => {
  const navigate = useNavigate();

  const handleNavigate = (blogDatas: BlogListState) => {
    navigate(ROUTER_ENUM.CREATE_BLOG, { state: { blogData: blogDatas } });
  };
  return (
    <GridItem
      borderRadius={"md"}
      boxShadow={"lg"}
      h="full"
      key={"blogsList" + index}
      display={"flex"}
      flexDirection={"column"}
      maxH={"27rem"}
    >
      <Image
        src={BlogImage}
        h={"10rem"}
        w={"full"}
        objectFit={"cover"}
        borderTopRadius={"md"}
      />
      <Box mx={3} my={2} flex={1}>
        <Text fontWeight={"semibold"} fontSize={"lg"}>
          {blogItem.heading}
        </Text>
        <Text fontSize={"sm"} color={"gray.500"} noOfLines={2}>
          {blogItem.description}
        </Text>

        <Text
          as={"p"}
          fontSize={"sm"}
          mt={2}
          noOfLines={3}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blogItem.content),
          }}
          flex={1}
        />
      </Box>
      <Box my={3} mx={3} display={"flex"} justifyContent={"flex-end"}>
        <Text
          fontSize={"sm"}
          textDecor={"underline"}
          fontWeight={"bold"}
          pr={4}
          cursor={"pointer"}
          color={colors.secondaryColor}
          onClick={() => {
            handleNavigate(blogItem);
          }}
        >
          Continue
        </Text>
      </Box>
    </GridItem>
  );
};

export default React.memo(BlogListItem);
