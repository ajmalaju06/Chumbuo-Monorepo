export interface CategoryProps {
  _id: string;
  name: string;
}

export type SaveCategory = Pick<CategoryProps, "name">;
