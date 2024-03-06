import { createContext, useContext, useState } from "react";

const LoggedContext = createContext();

export function useLoggedContext() {
  return useContext(LoggedContext);
}

export function LoggedProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoggedContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoggedContext.Provider>
  );
}
