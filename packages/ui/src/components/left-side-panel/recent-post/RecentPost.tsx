import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { colors } from "../../../theme/colors";
import BannerImage1 from "../../../assets/images/banner-image-4.jpg";

const RecentPost = () => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        position={"relative"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Text
          textAlign={"center"}
          fontSize={"xl"}
          fontFamily={"Lustria !important"}
          letterSpacing={"1px"}
        >
          BEAUTY OF NATURE
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
      <Image
        src={BannerImage1}
        alt="banner"
        h={"30rem"}
        w={"full"}
        objectFit={"cover"}
        mt={5}
      />
      <Text fontSize={"sm"} color={colors.textColor} noOfLines={2} mt={5}>
        Lorem ipsum dosectetur adipisicing elit, sed do.Lorem ipsum dolor sit
        amet, consectetur Nulla fringilla purus at leo dignissim congue. Mauris
        elementum accumsan leo vel tempor. Sit amet cursus nisl aliquam. …
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
  );
};

export default RecentPost;
