import { Box, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import useStore from "../../provider/store/useStore";

const Header = () => {
  const { scrollPosition } = useStore();

  return (
    <Box
      bg="white"
      w={"full"}
      position={"fixed"}
      transition={"0.5s ease-in-out"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      zIndex={20}
      boxShadow={"md"}
    >
      <Text
        w="full"
        textAlign={"center"}
        fontSize={scrollPosition >= 100 ? "0px" : "80px"}
        fontWeight={"semibold"}
        transition={"0.5s ease-in-out"}
        noOfLines={1}
        fontFamily={"enjelina !important"}
        pr={2}
        my={scrollPosition >= 100 ? "0px" : "1rem"}
      >
        Chumbuo
      </Text>
      <HeaderMenu />
    </Box>
  );
};

export default React.memo(Header);
