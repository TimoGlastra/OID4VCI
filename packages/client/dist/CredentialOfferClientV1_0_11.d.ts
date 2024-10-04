import { CredentialOfferRequestWithBaseUrl, CredentialOfferRequestWithBaseUrlV1_0_11, OpenId4VCIVersion } from '@sphereon/oid4vci-common';
export declare class CredentialOfferClientV1_0_11 {
    static fromURI(uri: string, opts?: {
        resolve?: boolean;
    }): Promise<CredentialOfferRequestWithBaseUrlV1_0_11>;
    static toURI(requestWithBaseUrl: CredentialOfferRequestWithBaseUrl, opts?: {
        version?: OpenId4VCIVersion;
    }): string;
}
//# sourceMappingURL=CredentialOfferClientV1_0_11.d.ts.map