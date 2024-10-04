import { JWK } from '@sphereon/oid4vc-common';
import { ExperimentalSubjectIssuance } from '../experimental/holder-vci';
import { ProofOfPossession } from './CredentialIssuance.types';
import { AlgValue, CommonCredentialRequest, CredentialDataSupplierInput, CredentialRequestMsoMdoc, CredentialRequestSdJwtVc, CredentialsSupportedDisplay, CredentialSupplierConfig, EncValue, Grant, IssuerCredentialSubject, MetadataDisplay, OID4VCICredentialFormat, ProofTypesSupported, ResponseEncryption } from './Generic.types';
import { QRCodeOpts } from './QRCode.types';
import { AuthorizationServerMetadata, AuthorizationServerType, EndpointMetadata } from './ServerMetadata';
export interface IssuerMetadataV1_0_13 {
    issuer?: string;
    credential_configurations_supported: Record<string, CredentialConfigurationSupportedV1_0_13>;
    credential_issuer: string;
    credential_endpoint: string;
    authorization_servers?: string[];
    batch_credential_endpoint?: string;
    deferred_credential_endpoint?: string;
    notification_endpoint?: string;
    credential_response_encryption?: ResponseEncryption;
    token_endpoint?: string;
    display?: MetadataDisplay[];
    [x: string]: unknown;
}
export type CredentialDefinitionJwtVcJsonV1_0_13 = {
    type: string[];
    credentialSubject?: IssuerCredentialSubject;
};
export type CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13 = {
    '@context': string[];
    type: string[];
    credentialSubject?: IssuerCredentialSubject;
};
export type CredentialConfigurationSupportedV1_0_13 = CredentialConfigurationSupportedCommonV1_0_13 & (CredentialConfigurationSupportedSdJwtVcV1_0_13 | CredentialConfigurationSupportedJwtVcJsonV1_0_13 | CredentialConfigurationSupportedJwtVcJsonLdAndLdpVcV1_0_13 | CredentialConfigurationSupportedMsoMdocV1_0_13);
export type CredentialConfigurationSupportedCommonV1_0_13 = {
    format: OID4VCICredentialFormat | 'string';
    scope?: string;
    cryptographic_binding_methods_supported?: string[];
    credential_signing_alg_values_supported?: string[];
    proof_types_supported?: ProofTypesSupported;
    display?: CredentialsSupportedDisplay[];
    [x: string]: unknown;
};
export interface CredentialConfigurationSupportedSdJwtVcV1_0_13 extends CredentialConfigurationSupportedCommonV1_0_13 {
    format: 'vc+sd-jwt';
    vct: string;
    claims?: IssuerCredentialSubject;
    order?: string[];
}
export interface CredentialConfigurationSupportedMsoMdocV1_0_13 extends CredentialConfigurationSupportedCommonV1_0_13 {
    format: 'mso_mdoc';
    doctype: string;
    claims?: IssuerCredentialSubject;
    order?: string[];
}
export interface CredentialConfigurationSupportedJwtVcJsonV1_0_13 extends CredentialConfigurationSupportedCommonV1_0_13 {
    format: 'jwt_vc_json' | 'jwt_vc';
    credential_definition: CredentialDefinitionJwtVcJsonV1_0_13;
    order?: string[];
}
export interface CredentialConfigurationSupportedJwtVcJsonLdAndLdpVcV1_0_13 extends CredentialConfigurationSupportedCommonV1_0_13 {
    format: 'ldp_vc' | 'jwt_vc_json-ld';
    credential_definition: CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13;
    order?: string[];
}
export type CredentialRequestV1_0_13ResponseEncryption = {
    jwk: JWK;
    alg: AlgValue;
    enc: EncValue;
};
export interface CredentialRequestV1_0_13Common extends ExperimentalSubjectIssuance {
    credential_response_encryption?: CredentialRequestV1_0_13ResponseEncryption;
    proof?: ProofOfPossession;
}
export type CredentialRequestV1_0_13 = CredentialRequestV1_0_13Common & (CredentialRequestJwtVcJsonV1_0_13 | CredentialRequestJwtVcJsonLdAndLdpVcV1_0_13 | CredentialRequestSdJwtVc | CredentialRequestMsoMdoc | CredentialRequestV1_0_13CredentialIdentifier);
/**
 * Normally a proof always needs to be present. There are exceptions for certain issuers doing strong user binding part of presentation flows
 */
export type CredentialRequestWithoutProofV1_0_13 = Omit<CredentialRequestV1_0_13Common, 'proof'> & (CredentialRequestJwtVcJsonV1_0_13 | CredentialRequestJwtVcJsonLdAndLdpVcV1_0_13 | CredentialRequestSdJwtVc | CredentialRequestMsoMdoc | CredentialRequestV1_0_13CredentialIdentifier);
export interface CredentialRequestV1_0_13CredentialIdentifier extends CredentialRequestV1_0_13Common {
    format?: undefined;
    credential_identifier: string;
}
export interface CredentialRequestJwtVcJsonV1_0_13 extends CommonCredentialRequest {
    format: 'jwt_vc_json' | 'jwt_vc';
    credential_definition: CredentialDefinitionJwtVcJsonV1_0_13;
}
export interface CredentialRequestJwtVcJsonLdAndLdpVcV1_0_13 extends CommonCredentialRequest {
    format: 'ldp_vc' | 'jwt_vc_json-ld';
    credential_definition: CredentialDefinitionJwtVcJsonLdAndLdpVcV1_0_13;
}
export interface CredentialOfferV1_0_13 {
    credential_offer?: CredentialOfferPayloadV1_0_13;
    credential_offer_uri?: string;
}
export interface CredentialOfferRESTRequest extends CredentialOfferV1_0_13 {
    baseUri?: string;
    scheme?: string;
    pinLength?: number;
    qrCodeOpts?: QRCodeOpts;
    credentialDataSupplierInput?: CredentialDataSupplierInput;
}
export interface CredentialOfferPayloadV1_0_13 {
    /**
     * REQUIRED. The URL of the Credential Issuer, as defined in Section 11.2.1, from which the Wallet is requested to
     * obtain one or more Credentials. The Wallet uses it to obtain the Credential Issuer's Metadata following the steps
     * defined in Section 11.2.2.
     */
    credential_issuer: string;
    /**
     *  REQUIRED. Array of unique strings that each identify one of the keys in the name/value pairs stored in
     *  the credential_configurations_supported Credential Issuer metadata. The Wallet uses these string values
     *  to obtain the respective object that contains information about the Credential being offered as defined
     *  in Section 11.2.3. For example, these string values can be used to obtain scope values to be used in
     *  the Authorization Request.
     */
    credential_configuration_ids: string[];
    /**
     * OPTIONAL. A JSON object indicating to the Wallet the Grant Types the Credential Issuer's AS is prepared
     * to process for this credential offer. Every grant is represented by a key and an object.
     * The key value is the Grant Type identifier, the object MAY contain parameters either determining the way
     * the Wallet MUST use the particular grant and/or parameters the Wallet MUST send with the respective request(s).
     * If grants is not present or empty, the Wallet MUST determine the Grant Types the Credential Issuer's AS supports
     * using the respective metadata. When multiple grants are present, it's at the Wallet's discretion which one to use.
     */
    grants?: Grant;
    /**
     * Some implementations might include a client_id in the offer. For instance EBSI in a same-device flow. (Cross-device tucks it in the state JWT)
     */
    client_id?: string;
}
export interface CredentialIssuerMetadataOptsV1_0_13 {
    credential_endpoint: string;
    batch_credential_endpoint?: string;
    deferred_credential_endpoint?: string;
    notification_endpoint?: string;
    credential_response_encryption?: ResponseEncryption;
    credential_identifiers_supported?: boolean;
    credential_configurations_supported: Record<string, CredentialConfigurationSupportedV1_0_13>;
    credential_issuer: string;
    authorization_servers?: string[];
    signed_metadata?: string;
    display?: MetadataDisplay[];
    token_endpoint?: string;
    credential_supplier_config?: CredentialSupplierConfig;
}
export interface EndpointMetadataResultV1_0_13 extends EndpointMetadata {
    authorizationServerType: AuthorizationServerType;
    authorizationServerMetadata?: AuthorizationServerMetadata;
    credentialIssuerMetadata?: Partial<AuthorizationServerMetadata> & IssuerMetadataV1_0_13;
}
export interface CredentialIssuerMetadataV1_0_13 extends CredentialIssuerMetadataOptsV1_0_13, Partial<AuthorizationServerMetadata> {
    authorization_servers?: string[];
    credential_endpoint: string;
    credential_configurations_supported: Record<string, CredentialConfigurationSupportedV1_0_13>;
    credential_issuer: string;
    credential_response_encryption_alg_values_supported?: string;
    credential_response_encryption_enc_values_supported?: string;
    require_credential_response_encryption?: boolean;
    credential_identifiers_supported?: boolean;
}
//# sourceMappingURL=v1_0_13.types.d.ts.map