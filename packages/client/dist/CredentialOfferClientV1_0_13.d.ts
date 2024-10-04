import { CredentialOfferRequestWithBaseUrl, OpenId4VCIVersion } from '@sphereon/oid4vci-common';
export declare class CredentialOfferClientV1_0_13 {
    static fromURI(uri: string, opts?: {
        resolve?: boolean;
    }): Promise<CredentialOfferRequestWithBaseUrl>;
    static toURI(requestWithBaseUrl: CredentialOfferRequestWithBaseUrl, opts?: {
        version?: OpenId4VCIVersion;
    }): string;
}
//# sourceMappingURL=CredentialOfferClientV1_0_13.d.ts.map