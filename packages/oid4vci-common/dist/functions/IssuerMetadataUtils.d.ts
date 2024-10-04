import { AuthorizationServerMetadata, CredentialConfigurationSupported, CredentialConfigurationSupportedV1_0_13, CredentialIssuerMetadata, CredentialSupportedTypeV1_0_08, CredentialSupportedV1_0_08, IssuerMetadata, MetadataDisplay, OID4VCICredentialFormat, OpenId4VCIVersion } from '../types';
export declare function getSupportedCredentials(opts?: {
    issuerMetadata?: CredentialIssuerMetadata | IssuerMetadata;
    version: OpenId4VCIVersion;
    types?: string[][];
    format?: OID4VCICredentialFormat | string | (OID4VCICredentialFormat | string)[];
}): Record<string, CredentialConfigurationSupportedV1_0_13> | Array<CredentialConfigurationSupported>;
export declare function determineVersionsFromIssuerMetadata(issuerMetadata: CredentialIssuerMetadata | IssuerMetadata): Array<OpenId4VCIVersion>;
export declare function getSupportedCredential(opts?: {
    issuerMetadata?: CredentialIssuerMetadata | IssuerMetadata;
    version: OpenId4VCIVersion;
    types?: string | string[];
    format?: OID4VCICredentialFormat | string | (OID4VCICredentialFormat | string)[];
}): Record<string, CredentialConfigurationSupportedV1_0_13> | Array<CredentialConfigurationSupported>;
export declare function credentialsSupportedV8ToV13(supportedV8: CredentialSupportedTypeV1_0_08): Record<string, CredentialConfigurationSupported>;
export declare function credentialSupportedV8ToV13(key: string, supportedV8: CredentialSupportedV1_0_08): Record<string, CredentialConfigurationSupported>;
export declare function getIssuerDisplays(metadata: CredentialIssuerMetadata | IssuerMetadata, opts?: {
    prefLocales: string[];
}): MetadataDisplay[];
/**
 * TODO check again when WAL-617 is done to replace how we get the issuer name.
 */
export declare function getIssuerName(url: string, credentialIssuerMetadata?: Partial<AuthorizationServerMetadata> & (CredentialIssuerMetadata | IssuerMetadata)): string;
//# sourceMappingURL=IssuerMetadataUtils.d.ts.map