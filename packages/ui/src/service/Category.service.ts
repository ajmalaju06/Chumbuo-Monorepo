import { baseURL } from "../utils/constants";
import http from "../utils/http-request";

const CategoryService = () => {
  const getAllCategories = async () => {
    try {
      const response = await http.get(`${baseURL}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  };

  return {
    getAllCategories,
  };
};
export default CategoryService;
