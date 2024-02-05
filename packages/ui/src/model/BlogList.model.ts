export interface BlogListItemProps {
  _id: string;
  userId: string;
  heading: string;
  description: string;
  content: string;
  categoryId: string;
}

export interface BlogListDetailsProps {
  categoryData?: BlogListItemProps[];
  isNextPageAvailable?: boolean;
  isPrevPageAvailable?: boolean;
}

export interface getAllBlogsProps {
  categoryId: string;
  pageNumber?: number;
}
