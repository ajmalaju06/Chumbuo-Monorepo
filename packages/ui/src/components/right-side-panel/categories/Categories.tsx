import React from "react";
import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { border, colors } from "../../../theme/colors";

const Categories = () => {
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
        CATEGORIES
      </Text>

      <UnorderedList
        display={"flex"}
        flexDirection={"column"}
        gap={3}
        justifyContent={"center"}
        mt={"1rem"}
        mb={"1rem"}
        listStyleType={"none"}
        mx={0}
      >
        {[1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => {
          return (
            <ListItem
              key={item}
              cursor={"pointer"}
              borderTop={index === 0 ? "0px" : border.boxBorderColor}
              py={1}
              _hover={{ color: "gray.400" }}
              transition={"0.3s ease-in-out"}
            >
              <Text>abcd</Text>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default Categories;
