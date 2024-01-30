import React from "react";
import {
  Box,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { border, colors } from "../../../theme/colors";
import { socialMedia } from "../../../data/Datas";

const SocialMedia = () => {
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
        FOLLOW ME ON
      </Text>
      <UnorderedList
        display={"flex"}
        gap={5}
        justifyContent={"center"}
        mt={"1rem"}
        mb={"1rem"}
        listStyleType={"none"}
        mx={0}
        alignItems={"center"}
      >
        {socialMedia.map((item) => {
          return (
            <ListItem key={item.id} cursor={"pointer"}>
              <Link href={item.link} isExternal>
                <Icon
                  as={item.icon}
                  color={colors.textColor}
                  fontSize={"lg"}
                  _hover={{ color: "gray.400" }}
                  transition={"0.3s ease-in-out"}
                />
              </Link>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(SocialMedia);
