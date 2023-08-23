import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_signup_signin"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://painefit.b2clogin.com/painefit.onmicrosoft.com/B2C_1_signup_signin",
        },
    },
    authorityDomain: "painefit.b2clogin.com"
}

export const msalConfig = {
    auth: {
        clientId: "aa2dcb21-2256-4e78-9eb2-1580f9cd6a3d", 
        authority: b2cPolicies.authorities.signUpSignIn.authority, 
        knownAuthorities: [b2cPolicies.authorityDomain], 
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false, 
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

export const loginRequest = {
    scopes: ["https://painefit.onmicrosoft.com/api/.default"]
};

export const acquireAccessToken = async (instance) => {
    const activeAccount = instance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
    const accounts = instance.getAllAccounts();
  
    if (!activeAccount && accounts.length === 0) {
        /*
        * User is not signed in. Throw error or wait for user to login.
        * Do not attempt to log a user in outside of the context of MsalProvider
        */   
    }
    const request = {
        scopes: loginRequest.scopes,
        account: activeAccount || accounts[0],
    };
  
    const authResult = await instance.acquireTokenSilent(request);
  
    return authResult;
  };