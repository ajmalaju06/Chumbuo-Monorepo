import { Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { colors } from "../../../theme/colors";
import { CategoryProps } from "../../../model/category.model";
import { IoClose } from "react-icons/io5";
import { AiFillTag } from "react-icons/ai";

interface CategoryListProps {
  categoryList?: CategoryProps[];
  handleDelete?: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categoryList,
  handleDelete,
}) => {
  return (
    <UnorderedList
      listStyleType={"none"}
      mt={"2rem"}
      display={"flex"}
      gap={5}
      flexWrap={"wrap"}
      overflowY={"auto"}
      mx={0}
    >
      {categoryList?.map((item) => {
        return (
          <ListItem
            bg={colors.PrimaryColor}
            py={2}
            px={3}
            display={"flex"}
            borderRadius={"4px"}
            color={"white"}
            alignItems={"center"}
            gap={3}
          >
            <Icon as={AiFillTag} />

            <Text>{item.name}</Text>
            <Icon
              as={IoClose}
              cursor={"pointer"}
              onClick={() => {
                if (handleDelete) handleDelete(item._id);
              }}
            />
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};

export default React.memo(CategoryList);
