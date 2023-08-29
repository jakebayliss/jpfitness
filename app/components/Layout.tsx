import { useState } from 'react';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "../auth/authConfig";
import { UserContext } from '../auth/UserContext';

export const msalInstance = new PublicClientApplication(msalConfig);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [products, setProducts] = useState<string[]>([]);

  return (
    <UserContext.Provider value={{user, setUser, products, setProducts}}>
      <MsalProvider instance={msalInstance}>
        {children}
      </MsalProvider>
    </UserContext.Provider>
  )
}

export default Layout;