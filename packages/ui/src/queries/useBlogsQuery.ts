import { useQuery } from "react-query";
import useShowToast from "../hook/useShowToast";
import BlogService from "../service/Blogs.service";
import { EndPoints } from "../utils/constants";

export const useGetAllBlogs = () => {
  const { getAllBlogs } = BlogService();
  const showToast = useShowToast();
  return useQuery([EndPoints.GET_ALL_BLOGS], () => getAllBlogs(), {
    onError: (error: Error) => {
      showToast("error", { message: error.message });
    },
  });
};
