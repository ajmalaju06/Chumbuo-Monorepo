import React, { useState } from "react";
import { Avatar, Box, Icon, Text } from "@chakra-ui/react";
import { colors, shadows } from "../../theme/colors";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import SidePannelMenu from "./SidePannelMenu";
import SidePannelprofile from "./SidePannelprofile";

const SidePannel = () => {
  const [isSidePannelOpen, setIsSidePannelOpen] = useState<boolean>(true);
  return (
    <Box
      width={isSidePannelOpen ? "15rem" : "5rem"}
      bg={colors.PrimaryColor}
      p={"15px"}
      h="full"
      display={"flex"}
      flexDirection={"column"}
      boxShadow={shadows.sidePannelShadow}
      transition={"0.5s ease-in-out"}
      userSelect={"none"}
      borderRadius={"sm"}
    >
      <Box w="full" display={"flex"} justifyContent={"flex-end"}>
        {isSidePannelOpen ? (
          <Icon
            as={AiOutlineDoubleLeft}
            fontSize={"15px"}
            color={"white"}
            cursor={"pointer"}
            _hover={{ scale: 1.4 }}
            onClick={() => setIsSidePannelOpen(false)}
          />
        ) : (
          <Icon
            as={AiOutlineDoubleRight}
            fontSize={"15px"}
            color={"white"}
            cursor={"pointer"}
            _hover={{ scale: 1.1 }}
            onClick={() => setIsSidePannelOpen(true)}
          />
        )}
      </Box>

      <Text
        mt={"2rem"}
        w="full"
        textAlign={"center"}
        fontSize={"35px"}
        fontWeight={"semibold"}
        color={"white"}
        transition={"0.5s ease-in-out"}
        noOfLines={1}
        fontFamily={"enjelina"}
        pr={2}
      >
        {isSidePannelOpen ? "Azhar" : "A"}
      </Text>

      <SidePannelprofile isPannelOpen={isSidePannelOpen} />

      <SidePannelMenu isPannelOpen={isSidePannelOpen} />
    </Box>
  );
};

export default React.memo(SidePannel);
