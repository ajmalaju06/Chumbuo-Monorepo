import React, { useMemo, useState } from "react";

import { RootContext } from "./useStore";

interface Children {
  children: JSX.Element;
}

const RootProvider: React.FC<Children> = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const store = useMemo(
    () => ({
      scrollPosition,
      setScrollPosition,
    }),
    [scrollPosition, setScrollPosition]
  );

  return <RootContext.Provider value={store}>{children}</RootContext.Provider>;
};

export default RootProvider;
