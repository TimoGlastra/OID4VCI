export interface OAuth2ASMetadata {
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

  pushed_authorization_request_endpoint?: string; // The URL of the pushed authorization request endpoint at which a client can post an authorization request to exchange for a request_uri value usable at the authorization server
  // Note that the presence of pushed_authorization_request_endpoint is sufficient for a client to determine that it may use the PAR flow. A request_uri value obtained from the PAR endpoint is usable at the authorization endpoint regardless of other authorization server metadata such as request_uri_parameter_supported or require_request_uri_registration
  require_pushed_authorization_requests?: boolean; // Boolean parameter indicating whether Indicates whether the client is required to use PAR to initiate authorization. If omitted, the default value is false.
  'pre-authorized_grant_anonymous_access_supported': boolean; // OPTIONAL. A JSON Boolean indicating whether the issuer accepts a Token Request with a Pre-Authorized Code but without a client id. The default is false

  // OIDC values
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

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [x: string]: any; //We use any, so you can access properties if you know the structure
}
