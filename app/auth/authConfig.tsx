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