import { createContext } from "react";
import { AccountInfo } from "@azure/msal-browser";

export type User = {
  user: AccountInfo | null
  setUser: (user: AccountInfo | null) => void,
  products: string[],
  setProducts: (products: string[]) => void
};

export const UserContext = createContext<User>({user: null, setUser: (value) => {}, products: [], setProducts: (value) => {}});