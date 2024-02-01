import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { colors } from "../../theme/colors";
import Subscribe from "../right-side-panel/subscribe/Subscribe";
import FooterBlogList from "./FooterBlogList";

const Footer = () => {
  return (
    <Box
      bg={colors.textColor}
      mt={"4rem"}
      display={"flex"}
      px={{ base: "2rem", md: "4rem" }}
      py={"3rem"}
      gap={"4rem"}
      flexDirection={{ base: "column", lg: "row" }}
    >
      <Box
        display={"flex"}
        w="full"
        flex={1}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text
          textAlign={"left"}
          fontSize={"40px"}
          fontWeight={"semibold"}
          transition={"0.5s ease-in-out"}
          noOfLines={1}
          fontFamily={"enjelina !important"}
          color={"white"}
          flex={1}
        >
          Chumbuo
        </Text>
        <Subscribe isFooter />
      </Box>
      <Box
        flex={1}
        display={"flex"}
        w="full"
        flexDirection={{ base: "column", md: "row" }}
      >
        <FooterBlogList heading="RECENT BLOGS" />
        <FooterBlogList heading="POPULAR BLOGS" />
      </Box>
    </Box>
  );
};

export default Footer;
