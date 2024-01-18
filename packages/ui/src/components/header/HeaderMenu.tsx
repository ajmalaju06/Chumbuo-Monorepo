import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { border, colors } from "../../theme/colors";
import { headerMenuItems } from "../../data/Datas";

const HeaderMenu = () => {
  return (
    <Box
      borderTop={border.headerMenuBorder}
      borderBottom={border.headerMenuBorder}
      py={3}
    >
      <UnorderedList
        display={"flex"}
        justifyContent={"center"}
        gap={14}
        fontSize={"sm"}
        listStyleType={"none"}
      >
        {headerMenuItems.map((item) => {
          return (
            <ListItem
              key={item.id}
              _hover={{ color: colors.gold }}
              fontWeight={"400"}
              transition={"0.3s ease-in-out"}
              cursor={"pointer"}
            >
              {item.name}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(HeaderMenu);
