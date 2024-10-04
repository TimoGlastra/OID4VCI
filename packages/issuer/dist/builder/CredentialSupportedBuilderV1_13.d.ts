import { CredentialConfigurationSupportedV1_0_13, CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13, CredentialDefinitionJwtVcJsonV1_0_13, CredentialsSupportedDisplay, IssuerCredentialSubject, IssuerCredentialSubjectDisplay, KeyProofType, OID4VCICredentialFormat, ProofType, ProofTypesSupported } from '@sphereon/oid4vci-common';
export declare class CredentialSupportedBuilderV1_13 {
    format?: OID4VCICredentialFormat;
    scope?: string;
    credentialName?: string;
    credentialDefinition?: CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13 | CredentialDefinitionJwtVcJsonV1_0_13;
    cryptographicBindingMethodsSupported?: ('jwk' | 'cose_key' | 'did' | string)[];
    credentialSigningAlgValuesSupported?: string[];
    proofTypesSupported?: ProofTypesSupported;
    display?: CredentialsSupportedDisplay[];
    credentialSubject?: IssuerCredentialSubject;
    withFormat(credentialFormat: OID4VCICredentialFormat): CredentialSupportedBuilderV1_13;
    withCredentialName(credentialName: string): CredentialSupportedBuilderV1_13;
    withCredentialDefinition(credentialDefinition: CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13 | CredentialDefinitionJwtVcJsonV1_0_13): CredentialSupportedBuilderV1_13;
    withScope(scope: string): CredentialSupportedBuilderV1_13;
    addCryptographicBindingMethod(method: string | string[]): CredentialSupportedBuilderV1_13;
    withCryptographicBindingMethod(method: string | string[]): CredentialSupportedBuilderV1_13;
    addCredentialSigningAlgValuesSupported(algValues: string | string[]): CredentialSupportedBuilderV1_13;
    withCredentialSigningAlgValuesSupported(algValues: string | string[]): CredentialSupportedBuilderV1_13;
    addProofTypesSupported(keyProofType: KeyProofType, proofType: ProofType): CredentialSupportedBuilderV1_13;
    withProofTypesSupported(proofTypesSupported: ProofTypesSupported): CredentialSupportedBuilderV1_13;
    addCredentialSupportedDisplay(credentialDisplay: CredentialsSupportedDisplay | CredentialsSupportedDisplay[]): CredentialSupportedBuilderV1_13;
    withCredentialSupportedDisplay(credentialDisplay: CredentialsSupportedDisplay | CredentialsSupportedDisplay[]): CredentialSupportedBuilderV1_13;
    withCredentialSubject(credentialSubject: IssuerCredentialSubject): this;
    addCredentialSubjectPropertyDisplay(subjectProperty: string, issuerCredentialSubjectDisplay: IssuerCredentialSubjectDisplay): CredentialSupportedBuilderV1_13;
    build(): Record<string, CredentialConfigurationSupportedV1_0_13>;
}
//# sourceMappingURL=CredentialSupportedBuilderV1_13.d.ts.map