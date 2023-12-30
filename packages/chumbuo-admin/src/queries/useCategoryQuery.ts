import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import useShowToast from "../hooks/useShowToast";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_CATEGORIES,
} from "../../constants";
import CategoryService from "../services/CategoryService";
import { SaveCategory } from "../model/category.model";

export const useGetAllCategories = () => {
  const showToast = useShowToast();
  return useQuery(
    [GET_ALL_CATEGORIES],
    () => CategoryService.getAllCategory(),
    {
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};

export const useCreatecategory = () => {
  const showToast = useShowToast();
  return useMutation(
    [CREATE_CATEGORY],
    (body: SaveCategory) => CategoryService.createCategory(body),
    {
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};

export const useDeleteCategory = () => {
  const showToast = useShowToast();
  return useMutation(
    [DELETE_CATEGORY],
    (id: string) => CategoryService.deleteCategory(id),
    {
      onSuccess: () => {},
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};
