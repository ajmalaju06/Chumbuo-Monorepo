import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { border, colors } from "../../../theme/colors";
import ProfileImg from "../../../assets/images/profile.jpg";
import Signature from "../../../assets/images/signature.png";

const AboutMe = () => {
  return (
    <Box border={border.boxBorderColor} px={4} py={4}>
      <Text
        fontSize={"12px"}
        textAlign={"center"}
        fontWeight={"600"}
        letterSpacing={"2px"}
        color={colors.textColor}
        mt={"1rem"}
      >
        ABOUT ME
      </Text>

      <Image
        src={ProfileImg}
        alt="profile"
        h={"14rem"}
        objectFit={"cover"}
        w="full"
        mt={"1rem"}
      />

      <Text
        fontSize={"sm"}
        color={colors.textColor}
        noOfLines={2}
        mt={5}
        textAlign={"left"}
      >
        Lorem ipsum dosectetur adipisicing elit, sed do.Lorem ipsum dolor sit
        amet, consectetur Nulla fringilla purus at leo
      </Text>

      <Image
        src={Signature}
        alt="profile"
        h={"2rem"}
        objectFit={"contain"}
        w="full"
        mt={"1rem"}
      />
    </Box>
  );
};

export default AboutMe;
