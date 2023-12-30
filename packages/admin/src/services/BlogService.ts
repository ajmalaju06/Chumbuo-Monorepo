import { baseURL } from "../../constants";
import http from "../../http";

const BlogService = {
  async getBlogs() {
    try {
      const response = await http.get(`${baseURL}/blogs`);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },
  async createBlog(reqBody: SaveBlogProps) {
    try {
      const response = await http.post(`${baseURL}/blogs`, reqBody);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },

  async updateBlog(id: string, reqBody: SaveBlogProps) {
    try {
      const response = await http.patch(`${baseURL}/blogs/${id}`, reqBody);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },
};

export default BlogService;
