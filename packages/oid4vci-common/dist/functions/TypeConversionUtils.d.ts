import { AuthorizationDetails, CredentialConfigurationSupportedMsoMdocV1_0_13, CredentialOfferPayload, CredentialSupportedMsoMdoc, UniformCredentialOfferPayload, UniformCredentialOfferRequest } from '../index';
import { CredentialConfigurationSupported, CredentialConfigurationSupportedSdJwtVcV1_0_13, CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13, CredentialDefinitionJwtVcJsonV1_0_13, CredentialOfferFormatV1_0_11, CredentialsSupportedLegacy, CredentialSupportedSdJwtVc, JsonLdIssuerCredentialDefinition } from '../types';
export declare function isW3cCredentialSupported(supported: CredentialConfigurationSupported | CredentialsSupportedLegacy): supported is Exclude<CredentialConfigurationSupported, CredentialConfigurationSupportedMsoMdocV1_0_13 | CredentialSupportedMsoMdoc | CredentialConfigurationSupportedSdJwtVcV1_0_13 | CredentialSupportedSdJwtVc>;
export declare const getNumberOrUndefined: (input?: string) => number | undefined;
/**
 * The specs had many places where types could be expressed. This method ensures we get them in any way possible
 * @param subject
 */
export declare function getTypesFromObject(subject: CredentialConfigurationSupported | CredentialOfferFormatV1_0_11 | CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13 | CredentialDefinitionJwtVcJsonV1_0_13 | JsonLdIssuerCredentialDefinition | string): string[] | undefined;
export declare function getTypesFromCredentialOffer(offer: UniformCredentialOfferRequest | CredentialOfferPayload | UniformCredentialOfferPayload, opts?: {
    configIdAsType?: boolean;
}): Array<Array<string>> | undefined;
export declare function getTypesFromAuthorizationDetails(authDetails: AuthorizationDetails, opts?: {
    configIdAsType?: boolean;
}): string[] | undefined;
export declare function getTypesFromCredentialSupported(credentialSupported: CredentialConfigurationSupported, opts?: {
    filterVerifiableCredential: boolean;
}): string[];
//# sourceMappingURL=TypeConversionUtils.d.ts.map