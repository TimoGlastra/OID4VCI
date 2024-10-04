import { CreateDPoPClientOpts, JWK } from '@sphereon/oid4vc-common';
import { AccessTokenRequestOpts, AccessTokenResponse, Alg, AuthorizationRequestOpts, AuthorizationResponse, AuthzFlowType, CredentialConfigurationSupportedV1_0_13, CredentialOfferRequestWithBaseUrl, CredentialResponse, DPoPResponseParams, EndpointMetadataResultV1_0_13, NotificationRequest, NotificationResult, OID4VCICredentialFormat, OpenId4VCIVersion, PKCEOpts, ProofOfPossessionCallbacks } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
import { CredentialRequestOpts } from './CredentialRequestClient';
export interface OpenID4VCIClientStateV1_0_13 {
    credentialIssuer: string;
    credentialOffer?: CredentialOfferRequestWithBaseUrl;
    clientId?: string;
    kid?: string;
    jwk?: JWK;
    alg?: Alg | string;
    endpointMetadata?: EndpointMetadataResultV1_0_13;
    accessTokenResponse?: AccessTokenResponse;
    dpopResponseParams?: DPoPResponseParams;
    authorizationRequestOpts?: AuthorizationRequestOpts;
    authorizationCodeResponse?: AuthorizationResponse;
    pkce: PKCEOpts;
    accessToken?: string;
    authorizationURL?: string;
}
export declare class OpenID4VCIClientV1_0_13 {
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
    }): Promise<OpenID4VCIClientV1_0_13>;
    static fromState({ state }: {
        state: OpenID4VCIClientStateV1_0_13 | string;
    }): Promise<OpenID4VCIClientV1_0_13>;
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
    }): Promise<OpenID4VCIClientV1_0_13>;
    /**
     * Allows you to create an Authorization Request URL when using an Authorization Code flow. This URL needs to be accessed using the front channel (browser)
     *
     * The Identity provider would present a login screen typically; after you authenticated, it would redirect to the provided redirectUri; which can be same device or cross-device
     * @param opts
     */
    createAuthorizationRequestUrl(opts?: {
        authorizationRequest?: AuthorizationRequestOpts;
        pkce?: PKCEOpts;
        headers?: Record<string, string>;
    }): Promise<string>;
    retrieveServerMetadata(): Promise<EndpointMetadataResultV1_0_13>;
    private calculatePKCEOpts;
    acquireAccessToken(opts?: Omit<AccessTokenRequestOpts, 'credentialOffer' | 'credentialIssuer' | 'metadata' | 'additionalParams'> & {
        clientId?: string;
        authorizationResponse?: string | AuthorizationResponse;
        additionalRequestParams?: Record<string, any>;
    }): Promise<AccessTokenResponse & {
        params?: DPoPResponseParams;
    }>;
    acquireCredentialsWithoutProof(args: {
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
        context?: string[];
        format?: CredentialFormat | OID4VCICredentialFormat;
        kid?: string;
        jwk?: JWK;
        alg?: Alg | string;
        jti?: string;
        deferredCredentialAwait?: boolean;
        deferredCredentialIntervalInMS?: number;
        experimentalHolderIssuanceSupported?: boolean;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<CredentialResponse & {
        access_token: string;
    }>;
    acquireCredentials(args: {
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
        context?: string[];
        proofCallbacks: ProofOfPossessionCallbacks<any>;
        format?: CredentialFormat | OID4VCICredentialFormat;
        kid?: string;
        jwk?: JWK;
        alg?: Alg | string;
        jti?: string;
        deferredCredentialAwait?: boolean;
        deferredCredentialIntervalInMS?: number;
        experimentalHolderIssuanceSupported?: boolean;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<CredentialResponse & {
        access_token: string;
    }>;
    private acquireCredentialsImpl;
    exportState(): Promise<string>;
    getCredentialsSupported(format?: (OID4VCICredentialFormat | string) | (OID4VCICredentialFormat | string)[]): Record<string, CredentialConfigurationSupportedV1_0_13>;
    sendNotification(credentialRequestOpts: Partial<CredentialRequestOpts>, request: NotificationRequest, accessToken?: string): Promise<NotificationResult>;
    issuerSupportedFlowTypes(): AuthzFlowType[];
    isFlowTypeSupported(flowType: AuthzFlowType): boolean;
    hasAuthorizationURL(): boolean;
    get authorizationURL(): string | undefined;
    get credentialOffer(): CredentialOfferRequestWithBaseUrl | undefined;
    version(): OpenId4VCIVersion;
    get endpointMetadata(): EndpointMetadataResultV1_0_13;
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
    isEBSI(): boolean;
    private assertIssuerData;
    private assertServerMetadata;
    private assertAccessToken;
    private syncAuthorizationRequestOpts;
}
//# sourceMappingURL=OpenID4VCIClientV1_0_13.d.ts.map