import { getAllBlogsProps } from "../model/BlogList.model";
import { baseURL } from "../utils/constants";
import http from "../utils/http-request";

const BlogService = () => {
  const getAllBlogs = async () => {
    try {
      const response = await http.get(`${baseURL}/blogs`);
      return response.data;
    } catch (error) {
      console.log("Error in API", error);
    }
  };

  const getAllBlogsByCategoryId = async (categoryId: getAllBlogsProps) => {
    try {
      const response = await http.post(
        `${baseURL}/blogs/searchByCategory`,
        categoryId
      );
      return response.data;
    } catch (error) {
      console.log("Error in API", error);
    }
  };

  return { getAllBlogs, getAllBlogsByCategoryId };
};

export default BlogService;
