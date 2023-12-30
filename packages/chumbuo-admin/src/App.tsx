import React from "react";

import "./App.css";
import { Box } from "@chakra-ui/react";
import Categories from "./pages/Categories";
import SidePannel from "./components/sidePannel/SidePannel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import CreateBlog from "./components/blogs/add-blog/CreateBlog";
import BlogList from "./components/blogs/blog-list/BlogList";
import { ROUTER_ENUM } from "./model/router.enum";

function App() {
  return (
    <Box display={"flex"} h="full" overflow={"hidden"} userSelect={"none"}>
      <BrowserRouter>
        <SidePannel />
        <Routes>
          <Route path={ROUTER_ENUM.HOME} element={<Home />} />
          <Route path={ROUTER_ENUM.CATEGORIES} element={<Categories />} />
          <Route path={ROUTER_ENUM.BLOGS} element={<Blogs />}>
            <Route index path={ROUTER_ENUM.BLOG_LISTS} element={<BlogList />} />
            <Route path={ROUTER_ENUM.CREATE_BLOG} element={<CreateBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default React.memo(App);
