import React, { useEffect, useId, useState } from "react";
import { Box, Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react";

import { menuItems } from "../../data/Datas";
import { colors } from "../../theme/colors";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER_ENUM } from "../../model/router.enum";

interface SidePannelMenuProps {
  isPannelOpen: boolean;
}
const SidePannelMenu: React.FC<SidePannelMenuProps> = ({ isPannelOpen }) => {
  const [selectedMenuId, setSelectedMenuId] = useState<number>(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case ROUTER_ENUM.HOME:
        setSelectedMenuId(0);
        break;

      case ROUTER_ENUM.CATEGORIES:
        setSelectedMenuId(1);
        break;

      case ROUTER_ENUM.CREATE_BLOG:
        setSelectedMenuId(2);
        break;
      case ROUTER_ENUM.BLOG_LISTS:
        setSelectedMenuId(2);
        break;

      default:
        setSelectedMenuId(0);
        break;
    }
  }, [pathname]);

  return (
    <Box mt={"3rem"} color={"white"}>
      <UnorderedList
        listStyleType={"none"}
        gap={3}
        display={"flex"}
        flexDirection={"column"}
        transition={"0.5s ease-in-out"}
        margin={"0px"}
        justifyContent={"flex-start"}
      >
        {menuItems.map((item, index) => {
          const isActive = index === selectedMenuId;
          return (
            <ListItem
              display={"flex"}
              alignItems={"center"}
              gap={3}
              bg={isActive ? colors.secondaryColor : colors.PrimaryColor}
              cursor={"pointer"}
              justifyContent={isPannelOpen ? "flex-start" : "center"}
              p={2}
              transition={"0.3s ease-in-out"}
              key={useId()}
              _hover={{ bg: colors.secondaryColor }}
              borderRadius={"md"}
              onClick={() => {
                navigate(item.path);
              }}
            >
              <Icon
                as={item.icon}
                transition={"0.3s ease-in-out"}
                fontSize={isPannelOpen ? "20px" : "25px"}
              />
              {isPannelOpen && (
                <Text transition="0.3s ease-in-out" noOfLines={1}>
                  {item.name}
                </Text>
              )}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(SidePannelMenu);
