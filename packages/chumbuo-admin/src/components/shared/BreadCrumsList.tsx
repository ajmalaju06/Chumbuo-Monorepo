import { Box, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";

const BreadCrumsList = () => {
  const navigate = useNavigate();

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      gap={3}
      bg={"gray.200"}
      w={"fit-content"}
      px={3}
      borderRadius={"md"}
    >
      <Icon
        as={IoArrowBackSharp}
        color={"gray.500"}
        cursor={"pointer"}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Text px={3} py={1} color={"gray.500"} borderRadius={"md"}>
        Blogs
      </Text>
      <Icon as={MdNavigateNext} color={"gray.500"} />
      <Text px={3} py={1} color={"gray.500"} borderRadius={"md"}>
        Blog list
      </Text>
      <Icon as={MdNavigateNext} color={"gray.500"} />
      <Text
        px={3}
        py={1}
        color={"gray.700"}
        borderRadius={"md"}
        fontWeight={"semibold"}
      >
        Create blog
      </Text>
    </Box>
  );
};

export default React.memo(BreadCrumsList);
