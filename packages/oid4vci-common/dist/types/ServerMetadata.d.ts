import { SigningAlgo } from '@sphereon/oid4vc-common';
export interface AuthorizationServerMetadata {
    issuer: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    token_endpoint_auth_methods_supported?: string[];
    token_endpoint_auth_signing_alg_values_supported?: string[];
    jwks_uri?: string;
    registration_endpoint?: string;
    scopes_supported?: string[];
    response_types_supported: string[];
    response_modes_supported?: string[];
    grant_types_supported?: string[];
    service_documentation?: string;
    ui_locales_supported?: string[];
    op_policy_uri?: string;
    op_tos_uri?: string;
    revocation_endpoint?: string;
    revocation_endpoint_auth_methods_supported?: string[];
    revocation_endpoint_auth_signing_alg_values_supported?: string[];
    introspection_endpoint?: string;
    code_challenge_methods_supported?: string[];
    pushed_authorization_request_endpoint?: string;
    require_pushed_authorization_requests?: boolean;
    'pre-authorized_grant_anonymous_access_supported': boolean;
    dpop_signing_alg_values_supported?: (string | SigningAlgo)[];
    frontchannel_logout_supported?: boolean;
    frontchannel_logout_session_supported?: boolean;
    backchannel_logout_supported?: boolean;
    backchannel_logout_session_supported?: boolean;
    userinfo_endpoint?: string;
    check_session_iframe?: string;
    end_session_endpoint?: string;
    acr_values_supported?: string[];
    subject_types_supported?: string[];
    request_object_signing_alg_values_supported?: string[];
    display_values_supported?: string[];
    claim_types_supported?: string[];
    claims_supported?: string[];
    claims_parameter_supported?: boolean;
    credential_endpoint?: string;
    deferred_credential_endpoint?: string;
    [x: string]: any;
}
export declare enum WellKnownEndpoints {
    OPENID_CONFIGURATION = "/.well-known/openid-configuration",
    OAUTH_AS = "/.well-known/oauth-authorization-server",
    OPENID4VCI_ISSUER = "/.well-known/openid-credential-issuer"
}
export type AuthorizationServerType = 'OIDC' | 'OAuth 2.0' | 'OID4VCI';
export interface EndpointMetadata {
    issuer: string;
    token_endpoint: string;
    credential_endpoint: string;
    deferred_credential_endpoint?: string;
    authorization_server?: string;
    authorization_endpoint?: string;
}
//# sourceMappingURL=ServerMetadata.d.ts.map