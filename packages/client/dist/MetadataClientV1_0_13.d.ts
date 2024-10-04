import { CredentialOfferPayloadV1_0_13, CredentialOfferRequestWithBaseUrl, EndpointMetadataResultV1_0_13, IssuerMetadataV1_0_13, OpenIDResponse } from '@sphereon/oid4vci-common';
export declare class MetadataClientV1_0_13 {
    /**
     * Retrieve metadata using the Initiation obtained from a previous step
     *
     * @param credentialOffer
     */
    static retrieveAllMetadataFromCredentialOffer(credentialOffer: CredentialOfferRequestWithBaseUrl): Promise<EndpointMetadataResultV1_0_13>;
    /**
     * Retrieve the metada using the initiation request obtained from a previous step
     * @param request
     */
    static retrieveAllMetadataFromCredentialOfferRequest(request: CredentialOfferPayloadV1_0_13): Promise<EndpointMetadataResultV1_0_13>;
    /**
     * Retrieve all metadata from an issuer
     * @param issuer The issuer URL
     * @param opts
     */
    static retrieveAllMetadata(issuer: string, opts?: {
        errorOnNotFound: boolean;
    }): Promise<EndpointMetadataResultV1_0_13>;
    /**
     * Retrieve only the OID4VCI metadata for the issuer. So no OIDC/OAuth2 metadata
     *
     * @param issuerHost The issuer hostname
     * @param opts
     */
    static retrieveOpenID4VCIServerMetadata(issuerHost: string, opts?: {
        errorOnNotFound?: boolean;
    }): Promise<OpenIDResponse<IssuerMetadataV1_0_13> | undefined>;
}
//# sourceMappingURL=MetadataClientV1_0_13.d.ts.map