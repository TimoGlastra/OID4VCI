import { AuthorizationRequestOpts, CredentialConfigurationSupportedV1_0_13, CredentialOfferRequestWithBaseUrl, EndpointMetadataResultV1_0_13, OpenId4VCIVersion, PKCEOpts, RequestObjectOpts } from '@sphereon/oid4vci-common';
export declare function createSignedAuthRequestWhenNeeded(requestObject: Record<string, any>, opts: RequestObjectOpts & {
    aud?: string;
}): Promise<void>;
export declare const createAuthorizationRequestUrl: ({ pkce, endpointMetadata, authorizationRequest, credentialOffer, credentialConfigurationSupported, clientId, version, headers }: {
    pkce: PKCEOpts;
    endpointMetadata: EndpointMetadataResultV1_0_13;
    authorizationRequest: AuthorizationRequestOpts;
    credentialOffer?: CredentialOfferRequestWithBaseUrl;
    credentialConfigurationSupported?: Record<string, CredentialConfigurationSupportedV1_0_13>;
    clientId?: string;
    version?: OpenId4VCIVersion;
    headers?: Record<string, string>;
}) => Promise<string>;
//# sourceMappingURL=AuthorizationCodeClient.d.ts.map