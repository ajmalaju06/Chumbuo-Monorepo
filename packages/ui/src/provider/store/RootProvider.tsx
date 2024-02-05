import React, { useMemo, useState } from "react";

import { RootContext } from "./useStore";
import { BlogListDetailsProps } from "../../model/BlogList.model";

interface Children {
  children: JSX.Element;
}

const RootProvider: React.FC<Children> = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [blogList, setBlogList] = useState<BlogListDetailsProps>({});

  const store = useMemo(
    () => ({
      scrollPosition,
      selectedCategoryId,
      blogList,
      setScrollPosition,
      setSelectedCategoryId,
      setBlogList,
    }),
    [
      scrollPosition,
      setScrollPosition,
      selectedCategoryId,
      setSelectedCategoryId,
      blogList,
      setBlogList,
    ]
  );

  return <RootContext.Provider value={store}>{children}</RootContext.Provider>;
};

export default RootProvider;
