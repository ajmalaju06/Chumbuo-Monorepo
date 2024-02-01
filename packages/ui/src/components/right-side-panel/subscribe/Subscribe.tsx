import React from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { colors } from "../../../theme/colors";

interface SubscribeProps {
  isFooter?: boolean;
}

const Subscribe: React.FC<SubscribeProps> = ({ isFooter }) => {
  return (
    <Box
      bg={colors.textColor}
      px={4}
      py={isFooter ? 0 : 7}
      flex={isFooter ? 1 : 0}
    >
      <Text
        color={isFooter ? colors.footerTextColor : "white"}
        fontSize={"12px"}
        textAlign={isFooter ? "left" : "center"}
        fontWeight={"600"}
        letterSpacing={"2px"}
        mt={isFooter ? 0 : 2}
      >
        {isFooter ? "SUBSCRIBE" : "SUBSCRIBE TO MY NEWSLETTER"}
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
