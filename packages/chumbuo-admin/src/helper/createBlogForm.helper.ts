export const createBlogFormInitialState: CreateBlogFormState = {
  heading: "",
  description: "",
  content: "",
  categoryId: "",
  userId: "",
};

export const validationRules = {
  heading: (value: string) => {
    if (!value) return "Heading is required.";
    return undefined;
  },
  description: (value: string) => {
    if (!value) return "Description is required.";
    return undefined;
  },
  categoryId: (value: string) => {
    if (!value) return "Category is required.";
    return undefined;
  },
};
