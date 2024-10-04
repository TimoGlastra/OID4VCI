import { CreateDPoPClientOpts, JWK } from '@sphereon/oid4vc-common';
import { AccessTokenRequestOpts, AccessTokenResponse, Alg, AuthorizationRequestOpts, AuthorizationResponse, AuthzFlowType, CredentialConfigurationSupported, CredentialOfferRequestWithBaseUrl, CredentialResponse, DPoPResponseParams, EndpointMetadataResultV1_0_11, OID4VCICredentialFormat, OpenId4VCIVersion, PKCEOpts, ProofOfPossessionCallbacks } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
export interface OpenID4VCIClientStateV1_0_11 {
    credentialIssuer: string;
    credentialOffer?: CredentialOfferRequestWithBaseUrl;
    clientId?: string;
    kid?: string;
    jwk?: JWK;
    alg?: Alg | string;
    endpointMetadata?: EndpointMetadataResultV1_0_11;
    accessTokenResponse?: AccessTokenResponse;
    dpopResponseParams?: DPoPResponseParams;
    authorizationRequestOpts?: AuthorizationRequestOpts;
    authorizationCodeResponse?: AuthorizationResponse;
    pkce: PKCEOpts;
    accessToken?: string;
    authorizationURL?: string;
}
export declare class OpenID4VCIClientV1_0_11 {
    private readonly _state;
    private constructor();
    static fromCredentialIssuer({ kid, alg, retrieveServerMetadata, clientId, credentialIssuer, pkce, authorizationRequest, createAuthorizationRequestURL, }: {
        credentialIssuer: string;
        kid?: string;
        alg?: Alg | string;
        retrieveServerMetadata?: boolean;
        clientId?: string;
        createAuthorizationRequestURL?: boolean;
        authorizationRequest?: AuthorizationRequestOpts;
        pkce?: PKCEOpts;
    }): Promise<OpenID4VCIClientV1_0_11>;
    static fromState({ state }: {
        state: OpenID4VCIClientStateV1_0_11 | string;
    }): Promise<OpenID4VCIClientV1_0_11>;
    static fromURI({ uri, kid, alg, retrieveServerMetadata, clientId, pkce, createAuthorizationRequestURL, authorizationRequest, resolveOfferUri, }: {
        uri: string;
        kid?: string;
        alg?: Alg | string;
        retrieveServerMetadata?: boolean;
        createAuthorizationRequestURL?: boolean;
        resolveOfferUri?: boolean;
        pkce?: PKCEOpts;
        clientId?: string;
        authorizationRequest?: AuthorizationRequestOpts;
    }): Promise<OpenID4VCIClientV1_0_11>;
    /**
     * Allows you to create an Authorization Request URL when using an Authorization Code flow. This URL needs to be accessed using the front channel (browser)
     *
     * The Identity provider would present a login screen typically; after you authenticated, it would redirect to the provided redirectUri; which can be same device or cross-device
     * @param opts
     */
    createAuthorizationRequestUrl(opts?: {
        authorizationRequest?: AuthorizationRequestOpts;
        pkce?: PKCEOpts;
    }): Promise<string>;
    retrieveServerMetadata(): Promise<EndpointMetadataResultV1_0_11>;
    private calculatePKCEOpts;
    acquireAccessToken(opts?: Omit<AccessTokenRequestOpts, 'credentialOffer' | 'credentialIssuer' | 'metadata' | 'additionalParams'> & {
        clientId?: string;
        authorizationResponse?: string | AuthorizationResponse;
        additionalRequestParams?: Record<string, any>;
    }): Promise<AccessTokenResponse & {
        params?: DPoPResponseParams;
    }>;
    acquireCredentials({ credentialTypes, context, proofCallbacks, format, kid, jwk, alg, jti, deferredCredentialAwait, deferredCredentialIntervalInMS, createDPoPOpts, }: {
        credentialTypes: string | string[];
        context?: string[];
        proofCallbacks: ProofOfPossessionCallbacks<any>;
        format?: CredentialFormat | OID4VCICredentialFormat;
        kid?: string;
        jwk?: JWK;
        alg?: Alg | string;
        jti?: string;
        deferredCredentialAwait?: boolean;
        deferredCredentialIntervalInMS?: number;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<CredentialResponse>;
    exportState(): Promise<string>;
    getCredentialsSupportedV11(restrictToInitiationTypes: boolean, format?: (OID4VCICredentialFormat | string) | (OID4VCICredentialFormat | string)[]): Record<string, CredentialConfigurationSupported>;
    getCredentialsSupported(format?: (OID4VCICredentialFormat | string) | (OID4VCICredentialFormat | string)[]): CredentialConfigurationSupported[];
    getCredentialOfferTypes(): string[][];
    issuerSupportedFlowTypes(): AuthzFlowType[];
    isFlowTypeSupported(flowType: AuthzFlowType): boolean;
    get authorizationURL(): string | undefined;
    hasAuthorizationURL(): boolean;
    get credentialOffer(): CredentialOfferRequestWithBaseUrl | undefined;
    version(): OpenId4VCIVersion;
    get endpointMetadata(): EndpointMetadataResultV1_0_11;
    get kid(): string;
    get alg(): string;
    set clientId(value: string | undefined);
    get clientId(): string | undefined;
    hasAccessTokenResponse(): boolean;
    get accessTokenResponse(): AccessTokenResponse;
    get dpopResponseParams(): DPoPResponseParams | undefined;
    getIssuer(): string;
    getAccessTokenEndpoint(): string;
    getCredentialEndpoint(): string;
    hasDeferredCredentialEndpoint(): boolean;
    getDeferredCredentialEndpoint(): string;
    /**
     * Too bad we need a method like this, but EBSI is not exposing metadata
     */
    isEBSI(): boolean | undefined;
    private assertIssuerData;
    private assertServerMetadata;
    private assertAccessToken;
    private syncAuthorizationRequestOpts;
}
//# sourceMappingURL=OpenID4VCIClientV1_0_11.d.ts.map