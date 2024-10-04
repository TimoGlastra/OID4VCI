import { AccessTokenResponse, CredentialIssuerMetadataV1_0_13, CredentialOfferRequestWithBaseUrl, EndpointMetadata, ExperimentalSubjectIssuance, OID4VCICredentialFormat, OpenId4VCIVersion, UniformCredentialOfferRequest } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
import { CredentialRequestClient } from './CredentialRequestClient';
export declare class CredentialRequestClientBuilderV1_0_13 {
    credentialEndpoint?: string;
    deferredCredentialEndpoint?: string;
    deferredCredentialAwait: boolean;
    deferredCredentialIntervalInMS: number;
    credentialIdentifier?: string;
    credentialTypes?: string[];
    format?: CredentialFormat | OID4VCICredentialFormat;
    token?: string;
    version?: OpenId4VCIVersion;
    subjectIssuance?: ExperimentalSubjectIssuance;
    static fromCredentialIssuer({ credentialIssuer, metadata, version, credentialIdentifier, credentialTypes, }: {
        credentialIssuer: string;
        metadata?: EndpointMetadata;
        version?: OpenId4VCIVersion;
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
    }): CredentialRequestClientBuilderV1_0_13;
    static fromURI({ uri, metadata }: {
        uri: string;
        metadata?: EndpointMetadata;
    }): Promise<CredentialRequestClientBuilderV1_0_13>;
    static fromCredentialOfferRequest(opts: {
        request: UniformCredentialOfferRequest;
        scheme?: string;
        baseUrl?: string;
        version?: OpenId4VCIVersion;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilderV1_0_13;
    static fromCredentialOffer({ credentialOffer, metadata, }: {
        credentialOffer: CredentialOfferRequestWithBaseUrl;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilderV1_0_13;
    withCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadataV1_0_13): this;
    withCredentialEndpoint(credentialEndpoint: string): this;
    withDeferredCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadataV1_0_13): this;
    withDeferredCredentialEndpoint(deferredCredentialEndpoint: string): this;
    withDeferredCredentialAwait(deferredCredentialAwait: boolean, deferredCredentialIntervalInMS?: number): this;
    withCredentialIdentifier(credentialIdentifier: string): this;
    withCredentialType(credentialTypes: string | string[]): this;
    withFormat(format: CredentialFormat | OID4VCICredentialFormat): this;
    withSubjectIssuance(subjectIssuance: ExperimentalSubjectIssuance): this;
    withToken(accessToken: string): this;
    withTokenFromResponse(response: AccessTokenResponse): this;
    withVersion(version: OpenId4VCIVersion): this;
    build(): CredentialRequestClient;
}
//# sourceMappingURL=CredentialRequestClientBuilderV1_0_13.d.ts.map