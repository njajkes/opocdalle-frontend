import { createContext, PropsWithChildren, useContext } from "react";
import { createInternalRouter } from "./routes";

const InternalRouterContext = createContext(createInternalRouter());

// eslint-disable-next-line react-refresh/only-export-components
export const useInternalRouter = () => useContext(InternalRouterContext);

export const InternalRouterProvider = ({ children }: PropsWithChildren) => {
  return (
    <InternalRouterContext.Provider value={createInternalRouter()}>
      {children}
    </InternalRouterContext.Provider>
  );
};
