import { createContext, useContext } from "react";

import { RootStore } from "./RootStore.interface";

export const RootContext = createContext<RootStore>({} as RootStore);

export default function useStore() {
  return useContext(RootContext);
}
