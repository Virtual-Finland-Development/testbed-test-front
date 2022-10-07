import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace AuthorizeRequest {
        export interface HeaderParameters {
            Authorization?: Parameters.Authorization;
            "X-Authorization-Provider"?: Parameters.XAuthorizationProvider;
            "X-Authorization-Context"?: Parameters.XAuthorizationContext;
        }
        namespace Parameters {
            export type Authorization = string;
            export type XAuthorizationContext = string;
            export type XAuthorizationProvider = string;
        }
        namespace Responses {
            export interface $200 {
                message?: string;
            }
            export interface $401 {
                message?: string;
            }
        }
    }
    namespace HealthCheck {
        namespace Responses {
            /**
             * example:
             * OK
             */
            export type $200 = string;
        }
    }
    namespace OpenIdAuthTokenRequest {
        namespace Parameters {
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface RequestBody {
            loginCode: string;
            appContext: string;
        }
        namespace Responses {
            export interface $200 {
                token?: string;
                expiresIn?: number;
            }
            export interface $401 {
                message?: string;
            }
        }
    }
    namespace OpenIdAuthenticateResponse {
        namespace Parameters {
            export type AcrValues = string;
            export type Code = string;
            export type Nonce = string;
            export type Provider = string;
            export type Scope = string;
            export type SessionState = string;
            export type Sid = string;
            export type State = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            code: Parameters.Code;
            state: Parameters.State;
            acr_values?: Parameters.AcrValues;
            scope?: Parameters.Scope;
            session_state?: Parameters.SessionState;
            sid?: Parameters.Sid;
            nonce?: Parameters.Nonce;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace OpenIdLoginRequest {
        namespace Parameters {
            export type AppContext = string;
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            appContext: Parameters.AppContext;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace OpenIdLogoutRequest {
        namespace Parameters {
            export type AppContext = string;
            export type IdToken = string;
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            appContext: Parameters.AppContext;
            idToken?: Parameters.IdToken;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace OpenIdLogoutResponse {
        namespace Parameters {
            export type Provider = string;
            export type State = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            state?: Parameters.State;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace OpenIdUserInfoRequest {
        namespace Parameters {
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface RequestBody {
            token?: string;
            appContext?: string;
        }
        namespace Responses {
            export interface $200 {
                sub?: string;
                inum?: string;
                email?: string;
            }
            export interface $401 {
                message?: string;
            }
        }
    }
    namespace Root {
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace Saml2AuthTokenRequest {
        namespace Parameters {
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface RequestBody {
            loginCode?: string;
            appContext?: string;
        }
        namespace Responses {
            export interface $200 {
                token?: string;
                expiresIn?: number;
            }
            export interface $401 {
                message?: string;
            }
        }
    }
    namespace Saml2AuthenticateResponse {
        namespace Parameters {
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace Saml2LoginRequest {
        namespace Parameters {
            export type AppContext = string;
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            appContext: Parameters.AppContext;
            provider?: Parameters.Provider;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace Saml2LogoutRequest {
        namespace Parameters {
            export type AppContext = string;
            export type IdToken = string;
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            appContext: Parameters.AppContext;
            idToken?: Parameters.IdToken;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace Saml2LogoutResponse {
        namespace Parameters {
            export type Provider = string;
            export type RelayState = string;
            export type SAMLResponse = string;
            export type SigAlg = string;
            export type Signature = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface QueryParameters {
            SAMLResponse: Parameters.SAMLResponse;
            RelayState: Parameters.RelayState;
            SigAlg: Parameters.SigAlg;
            Signature: Parameters.Signature;
        }
        namespace Responses {
            export interface $307 {
            }
        }
    }
    namespace Saml2UserInfoRequest {
        namespace Parameters {
            export type Provider = string;
        }
        export interface PathParameters {
            provider: Parameters.Provider;
        }
        export interface RequestBody {
            token?: string;
            appContext?: string;
        }
        namespace Responses {
            export interface $200 {
            }
            export interface $401 {
                message?: string;
            }
        }
    }
    namespace Swagger {
        namespace Responses {
            export interface $307 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * root
   */
  'root'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * swagger
   */
  'swagger'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * healthCheck
   */
  'healthCheck'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.HealthCheck.Responses.$200>
  /**
   * AuthorizeRequest
   */
  'AuthorizeRequest'(
    parameters?: Parameters<Paths.AuthorizeRequest.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AuthorizeRequest.Responses.$200>
  /**
   * OpenIdLoginRequest
   */
  'OpenIdLoginRequest'(
    parameters?: Parameters<Paths.OpenIdLoginRequest.PathParameters & Paths.OpenIdLoginRequest.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * OpenIdAuthenticateResponse
   */
  'OpenIdAuthenticateResponse'(
    parameters?: Parameters<Paths.OpenIdAuthenticateResponse.PathParameters & Paths.OpenIdAuthenticateResponse.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * OpenIdLogoutRequest
   */
  'OpenIdLogoutRequest'(
    parameters?: Parameters<Paths.OpenIdLogoutRequest.PathParameters & Paths.OpenIdLogoutRequest.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * OpenIdLogoutResponse
   */
  'OpenIdLogoutResponse'(
    parameters?: Parameters<Paths.OpenIdLogoutResponse.PathParameters & Paths.OpenIdLogoutResponse.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * OpenIdAuthTokenRequest
   */
  'OpenIdAuthTokenRequest'(
    parameters?: Parameters<Paths.OpenIdAuthTokenRequest.PathParameters> | null,
    data?: Paths.OpenIdAuthTokenRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OpenIdAuthTokenRequest.Responses.$200>
  /**
   * OpenIdUserInfoRequest
   */
  'OpenIdUserInfoRequest'(
    parameters?: Parameters<Paths.OpenIdUserInfoRequest.PathParameters> | null,
    data?: Paths.OpenIdUserInfoRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OpenIdUserInfoRequest.Responses.$200>
  /**
   * Saml2LoginRequest
   */
  'Saml2LoginRequest'(
    parameters?: Parameters<Paths.Saml2LoginRequest.PathParameters & Paths.Saml2LoginRequest.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * Saml2AuthenticateResponse
   */
  'Saml2AuthenticateResponse'(
    parameters?: Parameters<Paths.Saml2AuthenticateResponse.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Saml2AuthenticateResponse.Responses.$200>
  /**
   * Saml2LogoutRequest
   */
  'Saml2LogoutRequest'(
    parameters?: Parameters<Paths.Saml2LogoutRequest.PathParameters & Paths.Saml2LogoutRequest.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * Saml2LogoutResponse
   */
  'Saml2LogoutResponse'(
    parameters?: Parameters<Paths.Saml2LogoutResponse.PathParameters & Paths.Saml2LogoutResponse.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * Saml2LogoutResponse
   */
  'Saml2LogoutResponse'(
    parameters?: Parameters<Paths.Saml2LogoutResponse.PathParameters & Paths.Saml2LogoutResponse.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * Saml2AuthTokenRequest
   */
  'Saml2AuthTokenRequest'(
    parameters?: Parameters<Paths.Saml2AuthTokenRequest.PathParameters> | null,
    data?: Paths.Saml2AuthTokenRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Saml2AuthTokenRequest.Responses.$200>
  /**
   * Saml2UserInfoRequest
   */
  'Saml2UserInfoRequest'(
    parameters?: Parameters<Paths.Saml2UserInfoRequest.PathParameters> | null,
    data?: Paths.Saml2UserInfoRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Saml2UserInfoRequest.Responses.$200>
}

export interface PathsDictionary {
  ['/']: {
    /**
     * root
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/swagger']: {
    /**
     * swagger
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/health']: {
    /**
     * healthCheck
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.HealthCheck.Responses.$200>
  }
  ['/authorize']: {
    /**
     * AuthorizeRequest
     */
    'post'(
      parameters?: Parameters<Paths.AuthorizeRequest.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AuthorizeRequest.Responses.$200>
  }
  ['/auth/openid/{provider}/login-request']: {
    /**
     * OpenIdLoginRequest
     */
    'get'(
      parameters?: Parameters<Paths.OpenIdLoginRequest.PathParameters & Paths.OpenIdLoginRequest.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/openid/{provider}/authenticate-response']: {
    /**
     * OpenIdAuthenticateResponse
     */
    'get'(
      parameters?: Parameters<Paths.OpenIdAuthenticateResponse.PathParameters & Paths.OpenIdAuthenticateResponse.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/openid/{provider}/logout-request']: {
    /**
     * OpenIdLogoutRequest
     */
    'get'(
      parameters?: Parameters<Paths.OpenIdLogoutRequest.PathParameters & Paths.OpenIdLogoutRequest.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/openid/{provider}/logout-response']: {
    /**
     * OpenIdLogoutResponse
     */
    'get'(
      parameters?: Parameters<Paths.OpenIdLogoutResponse.PathParameters & Paths.OpenIdLogoutResponse.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/openid/{provider}/auth-token-request']: {
    /**
     * OpenIdAuthTokenRequest
     */
    'post'(
      parameters?: Parameters<Paths.OpenIdAuthTokenRequest.PathParameters> | null,
      data?: Paths.OpenIdAuthTokenRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OpenIdAuthTokenRequest.Responses.$200>
  }
  ['/auth/openid/{provider}/user-info-request']: {
    /**
     * OpenIdUserInfoRequest
     */
    'post'(
      parameters?: Parameters<Paths.OpenIdUserInfoRequest.PathParameters> | null,
      data?: Paths.OpenIdUserInfoRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OpenIdUserInfoRequest.Responses.$200>
  }
  ['/auth/saml2/{provider}/login-request']: {
    /**
     * Saml2LoginRequest
     */
    'get'(
      parameters?: Parameters<Paths.Saml2LoginRequest.PathParameters & Paths.Saml2LoginRequest.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/saml2/{provider}/authenticate-response']: {
    /**
     * Saml2AuthenticateResponse
     */
    'post'(
      parameters?: Parameters<Paths.Saml2AuthenticateResponse.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Saml2AuthenticateResponse.Responses.$200>
  }
  ['/auth/saml2/{provider}/logout-request']: {
    /**
     * Saml2LogoutRequest
     */
    'get'(
      parameters?: Parameters<Paths.Saml2LogoutRequest.PathParameters & Paths.Saml2LogoutRequest.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/saml2/{provider}/logout-response']: {
    /**
     * Saml2LogoutResponse
     */
    'get'(
      parameters?: Parameters<Paths.Saml2LogoutResponse.PathParameters & Paths.Saml2LogoutResponse.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/saml2/{provider}/logout']: {
    /**
     * Saml2LogoutResponse
     */
    'get'(
      parameters?: Parameters<Paths.Saml2LogoutResponse.PathParameters & Paths.Saml2LogoutResponse.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/auth/saml2/{provider}/auth-token-request']: {
    /**
     * Saml2AuthTokenRequest
     */
    'post'(
      parameters?: Parameters<Paths.Saml2AuthTokenRequest.PathParameters> | null,
      data?: Paths.Saml2AuthTokenRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Saml2AuthTokenRequest.Responses.$200>
  }
  ['/auth/saml2/{provider}/user-info-request']: {
    /**
     * Saml2UserInfoRequest
     */
    'post'(
      parameters?: Parameters<Paths.Saml2UserInfoRequest.PathParameters> | null,
      data?: Paths.Saml2UserInfoRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Saml2UserInfoRequest.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
