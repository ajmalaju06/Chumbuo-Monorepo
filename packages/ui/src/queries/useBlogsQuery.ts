import { useMutation, useQuery } from "react-query";
import useShowToast from "../hook/useShowToast";
import BlogService from "../service/Blogs.service";
import { EndPoints } from "../utils/constants";
import { getAllBlogsProps } from "../model/BlogList.model";

export const useGetAllBlogs = () => {
  const { getAllBlogs } = BlogService();
  const showToast = useShowToast();
  return useQuery([EndPoints.GET_ALL_BLOGS], () => getAllBlogs(), {
    onError: (error: Error) => {
      showToast("error", { message: error.message });
    },
  });
};

export const useGetAllBlogsByCategoryId = () => {
  const { getAllBlogsByCategoryId } = BlogService();
  const showToast = useShowToast();
  return useMutation(
    [EndPoints.GET_ALL_BLOGS_BY_CATEGORY],
    (body: getAllBlogsProps) => getAllBlogsByCategoryId(body),
    {
      onError: (error: Error) => {
        showToast("error", { message: error.message });
      },
    }
  );
};
