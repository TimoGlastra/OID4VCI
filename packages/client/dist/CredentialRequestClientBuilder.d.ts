import { AccessTokenResponse, CredentialIssuerMetadata, CredentialIssuerMetadataV1_0_13, CredentialOfferRequestWithBaseUrl, EndpointMetadata, ExperimentalSubjectIssuance, OID4VCICredentialFormat, OpenId4VCIVersion, UniformCredentialOfferRequest } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
export declare class CredentialRequestClientBuilder {
    private _builder;
    private constructor();
    static fromCredentialIssuer({ credentialIssuer, metadata, version, credentialIdentifier, credentialTypes, }: {
        credentialIssuer: string;
        metadata?: EndpointMetadata;
        version?: OpenId4VCIVersion;
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
    }): CredentialRequestClientBuilder;
    static fromURI({ uri, metadata }: {
        uri: string;
        metadata?: EndpointMetadata;
    }): Promise<CredentialRequestClientBuilder>;
    static fromCredentialOfferRequest(opts: {
        request: UniformCredentialOfferRequest;
        scheme?: string;
        baseUrl?: string;
        version?: OpenId4VCIVersion;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilder;
    static fromCredentialOffer({ credentialOffer, metadata, }: {
        credentialOffer: CredentialOfferRequestWithBaseUrl;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilder;
    getVersion(): OpenId4VCIVersion | undefined;
    withCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadata | CredentialIssuerMetadataV1_0_13): this;
    withCredentialEndpoint(credentialEndpoint: string): this;
    withDeferredCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadata | CredentialIssuerMetadataV1_0_13): this;
    withDeferredCredentialEndpoint(deferredCredentialEndpoint: string): this;
    withDeferredCredentialAwait(deferredCredentialAwait: boolean, deferredCredentialIntervalInMS?: number): this;
    withCredentialIdentifier(credentialIdentifier: string): this;
    withCredentialType(credentialTypes: string | string[]): this;
    withFormat(format: CredentialFormat | OID4VCICredentialFormat): this;
    withSubjectIssuance(subjectIssuance: ExperimentalSubjectIssuance): this;
    withToken(accessToken: string): this;
    withTokenFromResponse(response: AccessTokenResponse): this;
    withVersion(version: OpenId4VCIVersion): this;
    build(): import("./CredentialRequestClientV1_0_11").CredentialRequestClientV1_0_11 | import("./CredentialRequestClient").CredentialRequestClient;
}
//# sourceMappingURL=CredentialRequestClientBuilder.d.ts.map