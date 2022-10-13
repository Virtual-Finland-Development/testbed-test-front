/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: operations["root"];
  };
  "/swagger": {
    get: operations["swagger"];
  };
  "/health": {
    get: operations["healthCheck"];
  };
  "/authorize": {
    post: operations["AuthorizeRequest"];
  };
  "/auth/openid/{provider}/login-request": {
    get: operations["OpenIdLoginRequest"];
  };
  "/auth/openid/{provider}/authenticate-response": {
    get: operations["OpenIdAuthenticateResponse"];
  };
  "/auth/openid/{provider}/logout-request": {
    get: operations["OpenIdLogoutRequest"];
  };
  "/auth/openid/{provider}/logout-response": {
    get: operations["OpenIdLogoutResponse"];
  };
  "/auth/openid/{provider}/auth-token-request": {
    post: operations["OpenIdAuthTokenRequest"];
  };
  "/auth/openid/{provider}/user-info-request": {
    post: operations["OpenIdUserInfoRequest"];
  };
  "/auth/saml2/{provider}/login-request": {
    get: operations["Saml2LoginRequest"];
  };
  "/auth/saml2/{provider}/authenticate-response": {
    post: operations["Saml2AuthenticateResponse"];
  };
  "/auth/saml2/{provider}/logout-request": {
    get: operations["Saml2LogoutRequest"];
  };
  "/auth/saml2/{provider}/logout-response": {
    get: operations["Saml2LogoutResponse"];
  };
  "/auth/saml2/{provider}/logout": paths["/auth/saml2/{provider}/logout-response"];
  "/auth/saml2/{provider}/auth-token-request": {
    post: operations["Saml2AuthTokenRequest"];
  };
  "/auth/saml2/{provider}/user-info-request": {
    post: operations["Saml2UserInfoRequest"];
  };
  "/auth/saml2/{provider}/.well-known/jwks.json": {
    get: operations["Saml2WellKnownJWKSRequest"];
  };
}

export interface components {}

export interface operations {
  root: {
    responses: {
      /** Redirect to the API documentation */
      303: never;
    };
  };
  swagger: {
    responses: {
      /** Redirect to the API documentation */
      303: never;
    };
  };
  healthCheck: {
    responses: {
      /** Health check response */
      200: {
        content: {
          "text/plain": string;
        };
      };
    };
  };
  AuthorizeRequest: {
    parameters: {
      header: {
        Authorization?: string;
        "X-Authorization-Provider"?: string;
        "X-Authorization-Context"?: string;
      };
    };
    responses: {
      /** Access granted message */
      200: {
        content: {
          "application/json": {
            /** @default Access Granted */
            message?: string;
          };
        };
      };
      /** Access denied message */
      401: {
        content: {
          "application/json": {
            /** @default Access Denied */
            message?: string;
          };
        };
      };
    };
  };
  OpenIdLoginRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Base64-encoded object with attributes: {appName: string, redirectUrl: string} */
        appContext: string;
      };
    };
    responses: {
      /** Redirect to the authentication provider service */
      303: never;
    };
  };
  OpenIdAuthenticateResponse: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Login code */
        code: string;
        /** Login state string */
        state: string;
        acr_values?: string;
        scope?: string;
        session_state?: string;
        sid?: string;
        nonce?: string;
      };
    };
    responses: {
      /** Authentication providers callback url, redirect back to the app context, provide loginCode and provider -variables as query params */
      303: never;
    };
  };
  OpenIdLogoutRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Base64-encoded object with attributes: {appName: string, redirectUrl: string} */
        appContext: string;
        /** Logout id_token hint */
        idToken?: string;
      };
    };
    responses: {
      /** Redirect to the authentication provider services logout endpoint */
      303: never;
    };
  };
  OpenIdLogoutResponse: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Base64-encoded object with attributes: {appName: string, redirectUrl: string} */
        state?: string;
      };
    };
    responses: {
      /** Authentication providers callback url, redirect back to the app context */
      303: never;
    };
  };
  OpenIdAuthTokenRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** Auth token */
      200: {
        content: {
          "application/json": {
            accessToken: string;
            /** @example 1233ab213.1233abec213.1233abecd213 */
            idToken: string;
            /**
             * Format: date-time
             * @description an ISO-8601 timestamp string that specifies the token expirity datetime
             * @example 2022-01-30T08:30:00.123Z
             */
            expiresAt: string;
          };
        };
      };
      /** Access token retrieval failed */
      401: {
        content: {
          "application/json": {
            message: string;
          };
        };
      };
    };
    /** Retrieve the authentication token from the auth provider service */
    requestBody: {
      content: {
        "application/json": {
          loginCode: string;
          appContext: string;
        };
      };
    };
  };
  OpenIdUserInfoRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** User info object */
      200: {
        content: {
          "application/json": {
            sub: string;
            inum?: string;
            email?: string;
          };
        };
      };
      /** Login invalid or expired */
      401: {
        content: {
          "application/json": {
            message: string;
          };
        };
      };
    };
    /** Retrieve user info from the auth provider service */
    requestBody: {
      content: {
        "application/json": {
          accessToken: string;
          appContext: string;
        };
      };
    };
  };
  Saml2LoginRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Base64-encoded object with attributes: {appName: string, redirectUrl: string} */
        appContext: string;
      };
    };
    responses: {
      /** Redirect to the authentication provider service */
      303: never;
    };
  };
  Saml2AuthenticateResponse: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** Authentication providers callback url, redirect back to the app context */
      303: never;
    };
  };
  Saml2LogoutRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Base64-encoded object with attributes: {appName: string, redirectUrl: string} */
        appContext: string;
        /** Logout id_token hint */
        idToken?: string;
      };
    };
    responses: {
      /** Redirect to the authentication provider service */
      303: never;
    };
  };
  Saml2LogoutResponse: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
      query: {
        /** Logout response */
        SAMLResponse: string;
        /** State string */
        RelayState: string;
        /** SigAlg */
        SigAlg: string;
        /** Signature */
        Signature: string;
      };
    };
    responses: {
      /** Authentication providers callback url, redirect back to the app context */
      303: never;
    };
  };
  Saml2AuthTokenRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** Auth token */
      200: {
        content: {
          "application/json": {
            accessToken: string;
            /** @example 1233ab213.1233abec213.1233abecd213 */
            idToken: string;
            /**
             * Format: date-time
             * @description an ISO-8601 timestamp string that specifies the token expirity datetime
             * @example 2022-01-30T08:30:00.123Z
             */
            expiresAt: string;
          };
        };
      };
      /** Access token retrieval failed */
      401: {
        content: {
          "application/json": {
            message: string;
          };
        };
      };
    };
    /** Retrieve the authentication token from the auth provider service */
    requestBody: {
      content: {
        "application/json": {
          loginCode: string;
          appContext: string;
        };
      };
    };
  };
  Saml2UserInfoRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** User info object */
      200: {
        content: {
          "application/json": {
            profile: {
              nameID: string;
              email: string;
            };
            context: {
              AuthnContextClassRef: string;
            };
            accessToken: string;
            /** @example 1233ab213.1233abec213.1233abecd213 */
            idToken: string;
            /**
             * Format: date-time
             * @description an ISO-8601 timestamp string that specifies the token expirity datetime
             * @example 2022-01-30T08:30:00.123Z
             */
            expiresAt: string;
          };
        };
      };
      /** Login invalid or expired */
      401: {
        content: {
          "application/json": {
            message: string;
          };
        };
      };
    };
    /** Retrieve user info from the auth provider service */
    requestBody: {
      content: {
        "application/json": {
          accessToken: string;
          appContext: string;
        };
      };
    };
  };
  Saml2WellKnownJWKSRequest: {
    parameters: {
      path: {
        /** Auth provider ident */
        provider: string;
      };
    };
    responses: {
      /** .well-known/jwks.json */
      200: unknown;
    };
  };
}

export interface external {}
