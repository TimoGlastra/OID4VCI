import { CredentialIssuerMetadataV1_0_11, CredentialOfferPayload, CredentialOfferRequestWithBaseUrl, EndpointMetadataResultV1_0_11, OpenIDResponse } from '@sphereon/oid4vci-common';
export declare class MetadataClientV1_0_11 {
    /**
     * Retrieve metadata using the Initiation obtained from a previous step
     *
     * @param credentialOffer
     */
    static retrieveAllMetadataFromCredentialOffer(credentialOffer: CredentialOfferRequestWithBaseUrl): Promise<EndpointMetadataResultV1_0_11>;
    /**
     * Retrieve the metada using the initiation request obtained from a previous step
     * @param request
     */
    static retrieveAllMetadataFromCredentialOfferRequest(request: CredentialOfferPayload): Promise<EndpointMetadataResultV1_0_11>;
    /**
     * Retrieve all metadata from an issuer
     * @param issuer The issuer URL
     * @param opts
     */
    static retrieveAllMetadata(issuer: string, opts?: {
        errorOnNotFound: boolean;
    }): Promise<EndpointMetadataResultV1_0_11>;
    /**
     * Retrieve only the OID4VCI metadata for the issuer. So no OIDC/OAuth2 metadata
     *
     * @param issuerHost The issuer hostname
     */
    static retrieveOpenID4VCIServerMetadata(issuerHost: string, opts?: {
        errorOnNotFound?: boolean;
    }): Promise<OpenIDResponse<CredentialIssuerMetadataV1_0_11> | undefined>;
}
//# sourceMappingURL=MetadataClientV1_0_11.d.ts.map