import { CredentialIssuerMetadataOpts, CredentialIssuerMetadataOptsV1_0_13, CredentialIssuerMetadataV1_0_11, CredentialOfferPayloadV1_0_11, CredentialOfferPayloadV1_0_13, CredentialOfferSession, CredentialOfferV1_0_11, CredentialOfferV1_0_13, Grant, IssuerMetadataV1_0_13, TxCode, UniformCredentialOffer } from '@sphereon/oid4vci-common';
export declare function createCredentialOfferObject(issuerMetadata?: CredentialIssuerMetadataOptsV1_0_13, opts?: {
    credentialOffer?: CredentialOfferPayloadV1_0_13;
    credentialOfferUri?: string;
    scheme?: string;
    baseUri?: string;
    issuerState?: string;
    grants?: Grant;
    txCode?: TxCode;
    preAuthorizedCode?: string;
}): CredentialOfferV1_0_13 & {
    scheme: string;
    grants: Grant;
    baseUri: string;
};
export declare function createCredentialOfferObjectv1_0_11(issuerMetadata?: CredentialIssuerMetadataOpts, opts?: {
    credentialOffer?: CredentialOfferPayloadV1_0_11;
    credentialOfferUri?: string;
    scheme?: string;
    baseUri?: string;
    issuerState?: string;
    preAuthorizedCode?: string;
    userPinRequired?: boolean;
}): CredentialOfferV1_0_11 & {
    scheme: string;
    grants: Grant;
    baseUri: string;
};
export declare function createCredentialOfferURIFromObject(credentialOffer: (CredentialOfferV1_0_13 | UniformCredentialOffer) & {
    scheme?: string;
    baseUri?: string;
    grant?: Grant;
}, opts?: {
    scheme?: string;
    baseUri?: string;
}): string;
export declare function createCredentialOfferURI(issuerMetadata?: IssuerMetadataV1_0_13, opts?: {
    state?: string;
    credentialOffer?: CredentialOfferPayloadV1_0_13;
    credentialOfferUri?: string;
    scheme?: string;
    preAuthorizedCode?: string;
    userPinRequired?: boolean;
}): string;
export declare function createCredentialOfferURIv1_0_11(issuerMetadata?: CredentialIssuerMetadataV1_0_11, opts?: {
    state?: string;
    credentialOffer?: CredentialOfferPayloadV1_0_11;
    credentialOfferUri?: string;
    scheme?: string;
    preAuthorizedCode?: string;
    userPinRequired?: boolean;
}): string;
export declare const isPreAuthorizedCodeExpired: (state: CredentialOfferSession, expirationDurationInSeconds: number) => boolean;
export declare const assertValidPinNumber: (pin?: string, pinLength?: number) => void;
//# sourceMappingURL=CredentialOfferUtils.d.ts.map