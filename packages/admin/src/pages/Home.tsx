import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Home = () => {
  return (
    <Box px={"4rem"} py={"4.3rem"}>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Home
      </Text>
    </Box>
  );
};

export default React.memo(Home);
