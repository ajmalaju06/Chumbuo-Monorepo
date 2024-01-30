import React from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { colors } from "../../../theme/colors";

const Subscribe = () => {
  return (
    <Box bg={colors.textColor} px={4} py={7}>
      <Text
        color={"white"}
        fontSize={"12px"}
        textAlign={"center"}
        fontWeight={"600"}
        letterSpacing={"2px"}
        mt={2}
      >
        SUBSCRIBE TO MY NEWSLETTER
      </Text>

      <Box display={"flex"} flexDirection={"column"} gap={2} mt={6} mb={4}>
        <Input
          placeholder="Your email address"
          bg="white"
          borderRadius={"none"}
          h={"35px"}
          fontSize={"sm"}
          _placeholder={{ fontStyle: "italic" }}
          _focusVisible={{ outline: "none" }}
        />
        <Button
          borderRadius={"none"}
          letterSpacing={"2px"}
          w={"full"}
          h={"35px"}
          fontSize={"xs"}
        >
          SUBSCRIBE
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(Subscribe);
