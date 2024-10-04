import { AuthorizationRequestOpts, CredentialOfferRequestWithBaseUrl, CredentialsSupportedLegacy, EndpointMetadataResultV1_0_11, PKCEOpts } from '@sphereon/oid4vci-common';
export declare const createAuthorizationRequestUrlV1_0_11: ({ pkce, endpointMetadata, authorizationRequest, credentialOffer, credentialsSupported, }: {
    pkce: PKCEOpts;
    endpointMetadata: EndpointMetadataResultV1_0_11;
    authorizationRequest: AuthorizationRequestOpts;
    credentialOffer?: CredentialOfferRequestWithBaseUrl;
    credentialsSupported?: CredentialsSupportedLegacy[];
}) => Promise<string>;
//# sourceMappingURL=AuthorizationCodeClientV1_0_11.d.ts.map