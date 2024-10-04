import { CreateDPoPClientOpts, JWK } from '@sphereon/oid4vc-common';
import { AccessTokenRequestOpts, AccessTokenResponse, Alg, AuthorizationRequestOpts, AuthorizationResponse, AuthzFlowType, CredentialConfigurationSupported, CredentialConfigurationSupportedV1_0_13, CredentialOfferRequestWithBaseUrl, CredentialResponse, DPoPResponseParams, EndpointMetadataResultV1_0_11, EndpointMetadataResultV1_0_13, NotificationRequest, NotificationResult, OID4VCICredentialFormat, OpenId4VCIVersion, PKCEOpts, ProofOfPossessionCallbacks } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
import { CredentialRequestOpts } from './CredentialRequestClient';
import { OpenID4VCIClientStateV1_0_11 } from './OpenID4VCIClientV1_0_11';
import { OpenID4VCIClientStateV1_0_13 } from './OpenID4VCIClientV1_0_13';
export type OpenID4VCIClientState = OpenID4VCIClientStateV1_0_11 | OpenID4VCIClientStateV1_0_13;
export type EndpointMetadataResult = EndpointMetadataResultV1_0_11 | EndpointMetadataResultV1_0_13;
export declare class OpenID4VCIClient {
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
    }): Promise<OpenID4VCIClient>;
    static fromState({ state }: {
        state: OpenID4VCIClientState | string;
    }): Promise<OpenID4VCIClient>;
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
    }): Promise<OpenID4VCIClient>;
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
    retrieveServerMetadata(): Promise<EndpointMetadataResult>;
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
        experimentalHolderIssuanceSupported?: boolean;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<CredentialResponse & {
        params?: DPoPResponseParams;
        access_token: string;
    }>;
    exportState(): Promise<string>;
    getCredentialsSupported(restrictToInitiationTypes?: boolean, format?: (OID4VCICredentialFormat | string) | (OID4VCICredentialFormat | string)[]): Record<string, CredentialConfigurationSupportedV1_0_13> | Array<CredentialConfigurationSupported>;
    sendNotification(credentialRequestOpts: Partial<CredentialRequestOpts>, request: NotificationRequest, accessToken?: string): Promise<NotificationResult>;
    getCredentialOfferTypes(): string[][] | undefined;
    issuerSupportedFlowTypes(): AuthzFlowType[];
    isFlowTypeSupported(flowType: AuthzFlowType): boolean;
    get authorizationURL(): string | undefined;
    hasAuthorizationURL(): boolean;
    get credentialOffer(): CredentialOfferRequestWithBaseUrl | undefined;
    version(): OpenId4VCIVersion;
    get endpointMetadata(): EndpointMetadataResult;
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
    isEBSI(): any;
    private assertIssuerData;
    private assertServerMetadata;
    private assertAccessToken;
    private syncAuthorizationRequestOpts;
}
//# sourceMappingURL=OpenID4VCIClient.d.ts.map