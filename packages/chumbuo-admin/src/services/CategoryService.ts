import http from "../../http";
import { baseURL } from "../../constants";
import { SaveCategory } from "../model/category.model";

const CategoryService = {
  async getAllCategory() {
    try {
      const response = await http.get(`${baseURL}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },
  async createCategory(reqBody: SaveCategory) {
    try {
      const response = await http.post(`${baseURL}/categories`, reqBody);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },
  async deleteCategory(id: string) {
    try {
      const response = await http.delete(`${baseURL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in API", error);
    }
  },
};

export default CategoryService;
