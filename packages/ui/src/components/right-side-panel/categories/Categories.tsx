import React, { useEffect, useState } from "react";
import { Box, Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { border, colors } from "../../../theme/colors";
import { useGetAllCategories } from "../../../queries/useCategoryQuery";
import { CategoryListProps } from "../../../model/Category.model";
import { IoClose } from "react-icons/io5";
import useStore from "../../../provider/store/useStore";
import { useGetAllBlogsByCategoryId } from "../../../queries/useBlogsQuery";

const Categories = () => {
  const [categoryList, setCategoryList] = useState<CategoryListProps[]>([]);
  const { selectedCategoryId, setSelectedCategoryId, setBlogList } = useStore();

  const { data } = useGetAllCategories();
  const { data: blogData, mutate } = useGetAllBlogsByCategoryId();

  useEffect(() => {
    if (data) {
      setCategoryList(data);
    }
  }, [data]);

  useEffect(() => {
    if (blogData) {
      setBlogList(blogData);
    }
  }, [blogData]);

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
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                transition={"0.3s ease-in-out"}
              >
                <Text
                  fontSize={"xs"}
                  flex={1}
                  _hover={{ color: "gray.400" }}
                  onClick={() => {
                    setSelectedCategoryId(item._id);
                    mutate({ categoryId: item._id, pageNumber: 1 });
                  }}
                >
                  {item.name}
                </Text>
                {selectedCategoryId === item._id ? (
                  <Icon
                    as={IoClose}
                    fontSize={"sm"}
                    cursor={"pointer"}
                    onClick={() => {
                      setSelectedCategoryId("");
                      mutate({ categoryId: "", pageNumber: 1 });
                    }}
                  />
                ) : null}
              </Box>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(Categories);
