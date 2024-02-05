import { BlogListDetailsProps } from "../../model/BlogList.model";

export interface RootStore {
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
  selectedCategoryId: string;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string>>;
  blogList: BlogListDetailsProps;
  setBlogList: React.Dispatch<React.SetStateAction<BlogListDetailsProps>>;
}
