import { ICredentialContextType, IVerifiableCredential, W3CVerifiableCredential } from '@sphereon/ssi-types';
import { ExperimentalSubjectIssuance } from '../experimental/holder-vci';
import { ProofOfPossession } from './CredentialIssuance.types';
import { AuthorizationServerMetadata } from './ServerMetadata';
import { CredentialOfferSession } from './StateManager.types';
import { IssuerMetadataV1_0_08 } from './v1_0_08.types';
import { CredentialRequestV1_0_11, EndpointMetadataResultV1_0_11 } from './v1_0_11.types';
import { CredentialConfigurationSupportedV1_0_13, CredentialRequestV1_0_13, EndpointMetadataResultV1_0_13, IssuerMetadataV1_0_13 } from './v1_0_13.types';
export type InputCharSet = 'numeric' | 'text';
export type KeyProofType = 'jwt' | 'cwt' | 'ldp_vp';
export type PoPMode = 'pop' | 'JWT';
/**
 * Important Note: please be aware that these Common interfaces are based on versions v1_0.11 and v1_0.09
 */
export interface ImageInfo {
    url?: string;
    alt_text?: string;
    [key: string]: unknown;
}
export type OID4VCICredentialFormat = 'jwt_vc_json' | 'jwt_vc_json-ld' | 'ldp_vc' | 'vc+sd-jwt' | 'jwt_vc' | 'mso_mdoc';
export interface NameAndLocale {
    name?: string;
    locale?: string;
    [key: string]: unknown;
}
export interface LogoAndColor {
    logo?: ImageInfo;
    description?: string;
    background_color?: string;
    text_color?: string;
}
export type CredentialsSupportedDisplay = NameAndLocale & LogoAndColor & {
    name: string;
    background_image?: ImageInfo;
};
export type MetadataDisplay = NameAndLocale & LogoAndColor & {
    name?: string;
};
export interface CredentialSupplierConfig {
    [key: string]: any;
}
export interface CredentialIssuerMetadataOpts {
    credential_endpoint?: string;
    batch_credential_endpoint?: string;
    credentials_supported: CredentialsSupportedLegacy[];
    credential_issuer: string;
    authorization_server?: string;
    token_endpoint?: string;
    notification_endpoint?: string;
    display?: MetadataDisplay[];
    credential_supplier_config?: CredentialSupplierConfig;
}
export type AlgValue = 'RS256' | 'ES256' | 'PS256' | 'HS256' | string;
export type EncValue = 'A128GCM' | 'A256GCM' | 'A128CBC-HS256' | 'A256CBC-HS512' | string;
export interface ResponseEncryption {
    /**
     * REQUIRED. Array containing a list of the JWE [RFC7516] encryption algorithms
     * (alg values) [RFC7518] supported by the Credential and Batch Credential Endpoint to encode the
     * Credential or Batch Credential Response in a JWT
     */
    alg_values_supported: AlgValue[];
    /**
     * REQUIRED. Array containing a list of the JWE [RFC7516] encryption algorithms
     * (enc values) [RFC7518] supported by the Credential and Batch Credential Endpoint to encode the
     * Credential or Batch Credential Response in a JWT
     */
    enc_values_supported: EncValue[];
    /**
     * REQUIRED. Boolean value specifying whether the Credential Issuer requires the
     * additional encryption on top of TLS for the Credential Response. If the value is true, the Credential
     * Issuer requires encryption for every Credential Response and therefore the Wallet MUST provide
     * encryption keys in the Credential Request. If the value is false, the Wallet MAY chose whether it
     * provides encryption keys or not.
     */
    encryption_required: boolean;
}
export interface CredentialIssuerMetadata extends CredentialIssuerMetadataOpts, Partial<AuthorizationServerMetadata> {
    authorization_servers?: string[];
    credential_endpoint: string;
    credential_configurations_supported: Record<string, CredentialConfigurationSupported>;
    credential_issuer: string;
    credential_response_encryption_alg_values_supported?: string;
    credential_response_encryption_enc_values_supported?: string;
    require_credential_response_encryption?: boolean;
    credential_identifiers_supported?: boolean;
}
export interface CredentialSupportedBrief {
    cryptographic_binding_methods_supported?: string[];
    cryptographic_suites_supported?: string[];
}
export interface ProofType {
    proof_signing_alg_values_supported: string[];
}
export type ProofTypesSupported = {
    [key in KeyProofType]?: ProofType;
};
export type CommonCredentialSupported = CredentialSupportedBrief & ExperimentalSubjectIssuance & {
    format: OID4VCICredentialFormat | string;
    id?: string;
    display?: CredentialsSupportedDisplay[];
    scope?: string;
    proof_types_supported?: ProofTypesSupported;
};
export interface CredentialSupportedJwtVcJsonLdAndLdpVc extends CommonCredentialSupported {
    types: string[];
    '@context': ICredentialContextType[];
    credentialSubject?: IssuerCredentialSubject;
    order?: string[];
    format: 'ldp_vc' | 'jwt_vc_json-ld';
}
export interface CredentialSupportedJwtVcJson extends CommonCredentialSupported {
    types: string[];
    credentialSubject?: IssuerCredentialSubject;
    order?: string[];
    format: 'jwt_vc_json' | 'jwt_vc';
}
export interface CredentialSupportedSdJwtVc extends CommonCredentialSupported {
    format: 'vc+sd-jwt';
    vct: string;
    claims?: IssuerCredentialSubject;
    order?: string[];
}
export interface CredentialSupportedMsoMdoc extends CommonCredentialSupported {
    format: 'mso_mdoc';
    doctype: string;
    claims?: IssuerCredentialSubject;
    order?: string[];
}
export type CredentialConfigurationSupported = CredentialConfigurationSupportedV1_0_13 | (CommonCredentialSupported & (CredentialSupportedJwtVcJson | CredentialSupportedJwtVcJsonLdAndLdpVc | CredentialSupportedSdJwtVc | CredentialSupportedMsoMdoc));
export type CredentialsSupportedLegacy = CommonCredentialSupported & (CredentialSupportedJwtVcJson | CredentialSupportedJwtVcJsonLdAndLdpVc | CredentialSupportedSdJwtVc | CredentialSupportedMsoMdoc);
export interface CommonCredentialOfferFormat {
    format: OID4VCICredentialFormat | string;
}
export interface CredentialOfferFormatJwtVcJsonLdAndLdpVc extends CommonCredentialOfferFormat {
    format: 'ldp_vc' | 'jwt_vc_json-ld';
    credential_definition: JsonLdIssuerCredentialDefinition;
}
export interface CredentialOfferFormatJwtVcJson extends CommonCredentialOfferFormat {
    format: 'jwt_vc_json' | 'jwt_vc';
    types: string[];
}
export interface CredentialOfferFormatSdJwtVc extends CommonCredentialOfferFormat {
    format: 'vc+sd-jwt';
    vct: string;
    claims?: IssuerCredentialSubject;
}
export interface CredentialOfferFormatMsoMdoc extends CommonCredentialOfferFormat {
    format: 'mso_mdoc';
    doctype: string;
    claims?: IssuerCredentialSubject;
}
export type CredentialOfferFormatV1_0_11 = CommonCredentialOfferFormat & (CredentialOfferFormatJwtVcJsonLdAndLdpVc | CredentialOfferFormatJwtVcJson | CredentialOfferFormatSdJwtVc | CredentialOfferFormatMsoMdoc);
/**
 * Optional storage that can help the credential Data Supplier. For instance to store credential input data during offer creation, if no additional data can be supplied later on
 */
export type CredentialDataSupplierInput = any;
export type CreateCredentialOfferURIResult = {
    uri: string;
    qrCodeDataUri?: string;
    session: CredentialOfferSession;
    userPin?: string;
    txCode?: TxCode;
};
export interface JsonLdIssuerCredentialDefinition {
    '@context': ICredentialContextType[];
    types: string[];
    credentialSubject?: IssuerCredentialSubject;
}
export interface ErrorResponse {
    error: string;
    error_description?: string;
    error_uri?: string;
    state?: string;
}
export type UniformCredentialRequest = CredentialRequestV1_0_11 | CredentialRequestV1_0_13;
export interface CommonCredentialRequest extends ExperimentalSubjectIssuance {
    format: OID4VCICredentialFormat;
    proof?: ProofOfPossession;
}
export interface CredentialRequestJwtVcJson extends CommonCredentialRequest {
    format: 'jwt_vc_json' | 'jwt_vc';
    types: string[];
    credentialSubject?: IssuerCredentialSubject;
}
export interface CredentialRequestJwtVcJsonLdAndLdpVc extends CommonCredentialRequest {
    format: 'ldp_vc' | 'jwt_vc_json-ld';
    credential_definition: JsonLdIssuerCredentialDefinition;
}
export interface CredentialRequestSdJwtVc extends CommonCredentialRequest {
    format: 'vc+sd-jwt';
    vct: string;
    claims?: IssuerCredentialSubject;
}
export interface CredentialRequestMsoMdoc extends CommonCredentialRequest {
    format: 'mso_mdoc';
    doctype: string;
    claims?: IssuerCredentialSubject;
}
export interface CommonCredentialResponse extends ExperimentalSubjectIssuance {
    credential?: W3CVerifiableCredential;
    acceptance_token?: string;
    c_nonce?: string;
    c_nonce_expires_in?: string;
}
export interface CredentialResponseLdpVc extends CommonCredentialResponse {
    credential: IVerifiableCredential;
}
export interface CredentialResponseJwtVc {
    credential: string;
}
export interface CredentialResponseSdJwtVc {
    credential: string;
}
export type IssuerCredentialSubjectDisplay = CredentialSubjectDisplay & {
    [key: string]: CredentialSubjectDisplay;
};
export interface CredentialSubjectDisplay {
    mandatory?: boolean;
    value_type?: string;
    display?: NameAndLocale[];
}
export interface IssuerCredentialSubject {
    [key: string]: IssuerCredentialSubjectDisplay;
}
export interface Grant {
    authorization_code?: GrantAuthorizationCode;
    'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: GrantUrnIetf;
}
export interface GrantAuthorizationCode {
    /**
     * OPTIONAL. String value created by the Credential Issuer and opaque to the Wallet that is used to bind the subsequent
     * Authorization Request with the Credential Issuer to a context set up during previous steps.
     */
    issuer_state?: string;
    /**
     * OPTIONAL string that the Wallet can use to identify the Authorization Server to use with this grant type when authorization_servers parameter in the Credential Issuer metadata has multiple entries. MUST NOT be used otherwise. The value of this parameter MUST match with one of the values in the authorization_servers array obtained from the Credential Issuer metadata
     */
    authorization_server?: string;
}
export interface TxCode {
    /**
     * OPTIONAL. String specifying the input character set. Possible values are numeric (only digits) and text (any characters). The default is numeric.
     */
    input_mode?: InputCharSet;
    /**
     * OPTIONAL. Integer specifying the length of the Transaction Code. This helps the Wallet to render the input screen and improve the user experience.
     */
    length?: number;
    /**
     * OPTIONAL. String containing guidance for the Holder of the Wallet on how to obtain the Transaction Code, e.g.,
     * describing over which communication channel it is delivered. The Wallet is RECOMMENDED to display this description
     * next to the Transaction Code input screen to improve the user experience. The length of the string MUST NOT exceed
     * 300 characters. The description does not support internationalization, however the Issuer MAY detect the Holder's
     * language by previous communication or an HTTP Accept-Language header within an HTTP GET request for a Credential Offer URI.
     */
    description?: string;
}
export interface GrantUrnIetf {
    /**
     * REQUIRED. The code representing the Credential Issuer's authorization for the Wallet to obtain Credentials of a certain type.
     */
    'pre-authorized_code': string;
    /**
     * OPTIONAL. Object specifying whether the Authorization Server expects presentation of a Transaction Code by the
     * End-User along with the Token Request in a Pre-Authorized Code Flow. If the Authorization Server does not expect a
     * Transaction Code, this object is absent; this is the default. The Transaction Code is intended to bind the Pre-Authorized
     * Code to a certain transaction to prevent replay of this code by an attacker that, for example, scanned the QR code while
     * standing behind the legitimate End-User. It is RECOMMENDED to send the Transaction Code via a separate channel. If the Wallet
     * decides to use the Pre-Authorized Code Flow, the Transaction Code value MUST be sent in the tx_code parameter with
     * the respective Token Request as defined in Section 6.1. If no length or description is given, this object may be empty,
     * indicating that a Transaction Code is required.
     */
    tx_code?: TxCode;
    /**
     * OPTIONAL. The minimum amount of time in seconds that the Wallet SHOULD wait between polling requests to the token endpoint (in case the Authorization Server responds with error code authorization_pending - see Section 6.3). If no value is provided, Wallets MUST use 5 as the default.
     */
    interval?: number;
    /**
     * OPTIONAL string that the Wallet can use to identify the Authorization Server to use with this grant type when authorization_servers parameter in the Credential Issuer metadata has multiple entries. MUST NOT be used otherwise. The value of this parameter MUST match with one of the values in the authorization_servers array obtained from the Credential Issuer metadata
     */
    authorization_server?: string;
    /**
     * OPTIONAL. Boolean value specifying whether the AS
     * expects presentation of the End-User PIN along with the Token Request
     * in a Pre-Authorized Code Flow. Default is false. This PIN is intended
     * to bind the Pre-Authorized Code to a certain transaction to prevent
     * replay of this code by an attacker that, for example, scanned the QR
     * code while standing behind the legitimate End-User. It is RECOMMENDED
     * to send a PIN via a separate channel. If the Wallet decides to use
     * the Pre-Authorized Code Flow, a PIN value MUST be sent in
     * the user_pin parameter with the respective Token Request.
     */
    user_pin_required?: boolean;
}
export declare const PRE_AUTH_CODE_LITERAL = "pre-authorized_code";
export declare const PRE_AUTH_GRANT_LITERAL = "urn:ietf:params:oauth:grant-type:pre-authorized_code";
export type EndpointMetadataResult = EndpointMetadataResultV1_0_13 | EndpointMetadataResultV1_0_11;
export type IssuerMetadata = IssuerMetadataV1_0_13 | IssuerMetadataV1_0_08;
export type NotificationEventType = 'credential_accepted' | 'credential_failure' | 'credential_deleted';
export interface NotificationRequest {
    notification_id: string;
    event: NotificationEventType | string;
    event_description?: string;
    credential?: any;
}
export type NotificationError = 'invalid_notification_id' | 'invalid_notification_request';
export type NotificationResult = {
    error: boolean;
    response?: NotificationErrorResponse;
};
export interface NotificationErrorResponse {
    error: NotificationError | string;
}
//# sourceMappingURL=Generic.types.d.ts.map