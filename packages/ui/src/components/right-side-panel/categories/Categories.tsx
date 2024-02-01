import React, { useEffect, useState } from "react";
import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { border, colors } from "../../../theme/colors";
import { useGetAllCategories } from "../../../queries/useCategoryQuery";
import { CategoryListProps } from "../../../model/Category.model";

const Categories = () => {
  const [categoryList, setCategoryList] = useState<CategoryListProps[]>([]);
  const { data } = useGetAllCategories();

  useEffect(() => {
    if (data) {
      setCategoryList(data);
      console.log(data);
    }
  }, [data]);

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
        maxH={"25rem"}
        overflowY={"auto"}
      >
        {categoryList.map((item, index) => {
          return (
            <ListItem
              key={item._id}
              cursor={"pointer"}
              borderTop={index === 0 ? "0px" : border.boxBorderColor}
              py={1}
              _hover={{ color: "gray.400" }}
              transition={"0.3s ease-in-out"}
            >
              <Text fontSize={"xs"}>{item.name}</Text>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(Categories);
