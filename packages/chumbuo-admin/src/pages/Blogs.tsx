import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Blogs = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearch = (searchVal: string) => {
    setSearchValue(searchVal);
  };

  return (
    <Box
      px={"4rem"}
      pt={"4.3rem"}
      pb={"2rem"}
      w="full"
      h="full"
      display={"flex"}
      flexDirection={"column"}
      flex={1}
    >
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        {pathname === "/blogs/add-blog" ? "Create Blog" : "Blogs"}
      </Text>

      <Box
        display={pathname === "/blogs/add-blog" ? "none" : "flex"}
        alignItems={"center"}
        gap={5}
        mt={"2rem"}
      >
        <Input
          placeholder="Search"
          flex={1}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            navigate("/blogs/add-blog");
          }}
        >
          Add new
        </Button>
      </Box>

      <Outlet />
    </Box>
  );
};

export default React.memo(Blogs);
