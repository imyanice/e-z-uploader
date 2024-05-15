import "../style.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { SidebarProvider } from "../components/SidebarContext";

function App({ Component, pageProps }: AppProps) {
  const [minimized, setMinimized] = useState<boolean>(true);

  return (
    <div className={"select-none"}>
      <SidebarProvider value={{ minimized, setMinimized }}>
        <Component {...pageProps} />
      </SidebarProvider>
    </div>
  );
}

export default App;
