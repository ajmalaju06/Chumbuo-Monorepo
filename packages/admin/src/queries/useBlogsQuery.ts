import { useMutation, useQuery } from "react-query";
import useShowToast from "../hooks/useShowToast";
import { CREATE_BLOG, GET_ALL_BLOG, UPDATE_BLOG } from "../../constants";
import BlogService from "../services/BlogService";

export const useGetAllBlogs = () => {
  const showToast = useShowToast();
  return useQuery([GET_ALL_BLOG], () => BlogService.getBlogs(), {
    onError: (error: Error) => {
      showToast("error", { message: error.message });
    },
  });
};

export const useCreateBlog = () => {
  const showToast = useShowToast();
  return useMutation(
    [CREATE_BLOG],
    (body: SaveBlogProps) => BlogService.createBlog(body),
    {
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};

export const useUpdateBlog = () => {
  const showToast = useShowToast();
  return useMutation(
    [UPDATE_BLOG],
    (data: { id: string; body: SaveBlogProps }) =>
      BlogService.updateBlog(data.id, data.body),
    {
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};
