import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import UserImg from "../../assets/images/userImg.jpg";
import AzharImg from "../../assets/images/azhar.jpeg";
import { shadows } from "../../theme/colors";

interface SidePannelProfileProps {
  isPannelOpen: boolean;
}
const SidePannelprofile: React.FC<SidePannelProfileProps> = ({
  isPannelOpen,
}) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      mt={"2rem"}
      gap={3}
    >
      <Avatar
        size={isPannelOpen ? "xl" : "md"}
        transition={"0.3s ease-in-out"}
        src={AzharImg}
        boxShadow={shadows.sidePannelAvatarShadow}
      />
      {isPannelOpen && (
        <Text color={"white"} fontSize={"md"} noOfLines={1}>
          Azhar Abdullah
        </Text>
      )}
    </Box>
  );
};

export default React.memo(SidePannelprofile);
