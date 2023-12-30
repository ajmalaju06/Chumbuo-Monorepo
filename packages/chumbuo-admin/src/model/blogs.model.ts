type CreateBlogFormState = {
  heading: string;
  description: string;
  content: string;
  categoryId: string;
  userId: string;
};

type BlogListState = CreateBlogFormState & {
  _id: string;
};

type SaveBlogProps = CreateBlogFormState;
