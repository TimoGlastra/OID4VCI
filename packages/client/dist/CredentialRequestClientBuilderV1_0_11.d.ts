import { AccessTokenResponse, CredentialIssuerMetadata, CredentialOfferRequestWithBaseUrl, EndpointMetadata, ExperimentalSubjectIssuance, OID4VCICredentialFormat, OpenId4VCIVersion, UniformCredentialOfferRequest } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
import { CredentialRequestClientV1_0_11 } from './CredentialRequestClientV1_0_11';
export declare class CredentialRequestClientBuilderV1_0_11 {
    credentialEndpoint?: string;
    deferredCredentialEndpoint?: string;
    deferredCredentialAwait: boolean;
    deferredCredentialIntervalInMS: number;
    credentialTypes: string[];
    format?: CredentialFormat | OID4VCICredentialFormat;
    token?: string;
    version?: OpenId4VCIVersion;
    subjectIssuance?: ExperimentalSubjectIssuance;
    static fromCredentialIssuer({ credentialIssuer, metadata, version, credentialTypes, }: {
        credentialIssuer: string;
        metadata?: EndpointMetadata;
        version?: OpenId4VCIVersion;
        credentialTypes: string | string[];
    }): CredentialRequestClientBuilderV1_0_11;
    static fromURI({ uri, metadata }: {
        uri: string;
        metadata?: EndpointMetadata;
    }): Promise<CredentialRequestClientBuilderV1_0_11>;
    static fromCredentialOfferRequest(opts: {
        request: UniformCredentialOfferRequest;
        scheme?: string;
        baseUrl?: string;
        version?: OpenId4VCIVersion;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilderV1_0_11;
    static fromCredentialOffer({ credentialOffer, metadata, }: {
        credentialOffer: CredentialOfferRequestWithBaseUrl;
        metadata?: EndpointMetadata;
    }): CredentialRequestClientBuilderV1_0_11;
    withCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadata): this;
    withCredentialEndpoint(credentialEndpoint: string): this;
    withDeferredCredentialEndpointFromMetadata(metadata: CredentialIssuerMetadata): this;
    withDeferredCredentialEndpoint(deferredCredentialEndpoint: string): this;
    withDeferredCredentialAwait(deferredCredentialAwait: boolean, deferredCredentialIntervalInMS?: number): this;
    withCredentialType(credentialTypes: string | string[]): this;
    withFormat(format: CredentialFormat | OID4VCICredentialFormat): this;
    withSubjectIssuance(subjectIssuance: ExperimentalSubjectIssuance): this;
    withToken(accessToken: string): this;
    withTokenFromResponse(response: AccessTokenResponse): this;
    withVersion(version: OpenId4VCIVersion): this;
    build(): CredentialRequestClientV1_0_11;
}
//# sourceMappingURL=CredentialRequestClientBuilderV1_0_11.d.ts.map