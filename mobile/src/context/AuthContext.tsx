import React, { createContext } from "react";

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  async function signIn() {
    console.log("Vamos logar");
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user: {
          name: "Bruno Henrique Papait",
          avatarUrl: "https://www.github.com/brunopapait.png",
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
