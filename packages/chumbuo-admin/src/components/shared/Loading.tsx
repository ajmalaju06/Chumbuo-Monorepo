import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { colors } from "../../theme/colors";

const Loading = () => {
  return (
    <Box
      h="full"
      w="full"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"absolute"}
      inset={0}
      zIndex={10}
    >
      <Box
        bg={"white"}
        w="9rem"
        h="8rem"
        borderRadius={"md"}
        boxShadow={"md"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.200"}
        flexDirection={"column"}
        gap={3}
      >
        <Spinner color={colors.secondaryColor} size={"lg"} />
        <Text>Loading...</Text>
      </Box>
    </Box>
  );
};

export default React.memo(Loading);
