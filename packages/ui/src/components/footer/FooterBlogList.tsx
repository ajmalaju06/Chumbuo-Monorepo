import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { colors } from "../../theme/colors";

interface FooterBlogListProps {
  heading?: string;
}

const FooterBlogList: React.FC<FooterBlogListProps> = ({ heading }) => {
  return (
    <Box flex={1}>
      <Text
        color={colors.footerTextColor}
        fontSize={"12px"}
        fontWeight={"600"}
        letterSpacing={"2px"}
      >
        {heading}
      </Text>
      <UnorderedList
        listStyleType={"none"}
        m={0}
        mt={"1rem"}
        gap={5}
        display={"flex"}
        flexDirection={"column"}
      >
        {[1, 2, 3].map(() => {
          return (
            <ListItem display={"flex"} flexDirection={"column"} gap={1}>
              <Text
                color={"white"}
                _hover={{ color: colors.gold }}
                fontSize={"xs"}
                fontFamily={"Lustria !important"}
                letterSpacing={"1px"}
                cursor={"pointer"}
                transition={"0.4s ease-in-out"}
              >
                BEAUTY OF NATURE
              </Text>
              <Text
                color={colors.footerTextColor}
                fontSize={"xs"}
                fontStyle={"italic"}
                opacity={0.8}
              >
                July 22, 2015
              </Text>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

export default React.memo(FooterBlogList);
