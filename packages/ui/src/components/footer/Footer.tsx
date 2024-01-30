import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { colors } from "../../theme/colors";
import Subscribe from "../right-side-panel/subscribe/Subscribe";

const Footer = () => {
  return (
    <Box bg={colors.textColor} mt={"4rem"} display={"flex"} px={"2rem"} py={10}>
      <Box display={"flex"}>
        <Text
          textAlign={"center"}
          fontSize={"40px"}
          fontWeight={"semibold"}
          transition={"0.5s ease-in-out"}
          noOfLines={1}
          fontFamily={"enjelina !important"}
          color={"white"}
        >
          Chumbuo
        </Text>
        <Subscribe />
      </Box>
      <Box></Box>
    </Box>
  );
};

export default Footer;
