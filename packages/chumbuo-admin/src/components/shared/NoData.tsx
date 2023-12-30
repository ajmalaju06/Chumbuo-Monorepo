import React from "react";
import { Box, Icon, Text } from "@chakra-ui/react";
import { FaRegFolderOpen } from "react-icons/fa6";

interface NoDataprops {
  heading: string;
}

const NoData: React.FC<NoDataprops> = ({ heading = "No Records" }) => {
  return (
    <Box
      h="full"
      w="full"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Icon as={FaRegFolderOpen} fontSize={"3rem"} />
      <Text fontSize={"xl"} fontWeight={"bold"}>
        {heading}
      </Text>
    </Box>
  );
};

export default React.memo(NoData);
