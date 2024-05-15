import { useContext, createContext, ReactNode } from "react";
interface ISidebarContext {
  minimized: boolean;
  setMinimized(minimized: boolean): void;
}
const defaultValues: ISidebarContext = {
  minimized: false,
  setMinimized(): any {},
};

const SidebarContext = createContext(defaultValues);

export const SidebarProvider = ({
  value,
  children,
}: {
  value: ISidebarContext;
  children: ReactNode;
}) => {
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext<ISidebarContext>(SidebarContext);
