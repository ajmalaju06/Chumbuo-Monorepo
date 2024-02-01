import { useQuery } from "react-query";
import useShowToast from "../hook/useShowToast";
import { EndPoints } from "../utils/constants";
import CategoryService from "../service/Category.service";

export const useGetAllCategories = () => {
  const { getAllCategories } = CategoryService();
  const showToast = useShowToast();
  return useQuery([EndPoints.GET_ALL_CATEGORIES], () => getAllCategories(), {
    onError: (error: Error) => {
      showToast("error", { message: error.message });
    },
  });
};
