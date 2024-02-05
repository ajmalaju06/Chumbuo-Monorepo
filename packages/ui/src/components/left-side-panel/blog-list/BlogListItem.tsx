import React from "react";
import { Box, GridItem, Image, Text } from "@chakra-ui/react";
import { colors } from "../../../theme/colors";
import BannerImage1 from "../../../assets/images/banner-image-5.jpg";
import { BlogListItemProps } from "../../../model/BlogList.model";

interface BlogListItemProp {
  blogListDetails: BlogListItemProps;
}

const BlogListItem: React.FC<BlogListItemProp> = ({ blogListDetails }) => {
  return (
    <GridItem w="100%">
      <Box display={"flex"} flexDirection={"column"} gap={5}>
        <Image
          src={BannerImage1}
          alt="banner"
          h={"20rem"}
          w={"full"}
          objectFit={"cover"}
          boxShadow={"xl"}
        />
        <Box
          position={"relative"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <Text
            textAlign={"center"}
            fontSize={"lg"}
            fontFamily={"Lustria !important"}
            letterSpacing={"1px"}
            color={colors.textColor}
          >
            {blogListDetails.heading.toUpperCase()}
          </Text>
          <Text
            w={"fit-content"}
            textAlign={"center"}
            bg={"white"}
            zIndex={1}
            fontFamily={"Lustria !important"}
            fontStyle={"italic"}
            fontSize={"sm"}
            color={colors.gold}
            px={3}
          >
            July 22, 2015
          </Text>
          <Box
            w="15rem"
            h={"1px"}
            position={"absolute"}
            bg={colors.gold}
            bottom={"10px"}
          />
        </Box>
      </Box>
      <Box>
        <Text
          fontSize={"sm"}
          color={colors.textColor}
          noOfLines={3}
          mt={5}
          textAlign={"left"}
        >
          {blogListDetails.description}
        </Text>
        <Text
          fontSize={"xs"}
          color={colors.gold}
          noOfLines={2}
          _hover={{ color: colors.textColor }}
          mt={3}
          fontWeight={"semibold"}
          cursor={"pointer"}
          transition={"0.3s ease-in-out"}
          letterSpacing={"2px"}
        >
          READ MORE
        </Text>
      </Box>
    </GridItem>
  );
};

export default React.memo(BlogListItem);
