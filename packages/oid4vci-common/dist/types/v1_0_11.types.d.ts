import { AuthorizationDetailsJwtVcJson, AuthorizationServerOpts, CommonAuthorizationRequest } from './Authorization.types';
import { UniformCredentialOffer, UniformCredentialOfferRequest } from './CredentialIssuance.types';
import { CommonCredentialRequest, CredentialDataSupplierInput, CredentialIssuerMetadataOpts, CredentialOfferFormatV1_0_11, CredentialRequestJwtVcJson, CredentialRequestJwtVcJsonLdAndLdpVc, CredentialRequestSdJwtVc, Grant } from './Generic.types';
import { QRCodeOpts } from './QRCode.types';
import { AuthorizationServerMetadata, AuthorizationServerType, EndpointMetadata } from './ServerMetadata';
import { IssuerMetadataV1_0_08 } from './v1_0_08.types';
export interface AccessTokenRequestOptsV1_0_11 {
    credentialOffer?: UniformCredentialOffer;
    credentialIssuer?: string;
    asOpts?: AuthorizationServerOpts;
    metadata?: EndpointMetadata;
    codeVerifier?: string;
    code?: string;
    redirectUri?: string;
    pin?: string;
}
export interface CredentialOfferV1_0_11 {
    credential_offer?: CredentialOfferPayloadV1_0_11;
    credential_offer_uri?: string;
}
export interface CredentialOfferRESTRequestV1_0_11 extends CredentialOfferV1_0_11 {
    baseUri?: string;
    scheme?: string;
    pinLength?: number;
    qrCodeOpts?: QRCodeOpts;
    credentialDataSupplierInput?: CredentialDataSupplierInput;
}
export interface CredentialOfferRequestWithBaseUrlV1_0_11 extends UniformCredentialOfferRequest {
    scheme: string;
    clientId?: string;
    baseUrl: string;
    userPinRequired: boolean;
    issuerState?: string;
    preAuthorizedCode?: string;
}
export interface CredentialOfferPayloadV1_0_11 {
    /**
     * REQUIRED. The URL of the Credential Issuer, the Wallet is requested to obtain one or more Credentials from.
     */
    credential_issuer: string;
    /**
     * REQUIRED. A JSON array, where every entry is a JSON object or a JSON string. If the entry is an object,
     * the object contains the data related to a certain credential type the Wallet MAY request.
     * Each object MUST contain a format Claim determining the format of the credential to be requested and
     * further parameters characterising the type of the credential to be requested as defined in Appendix E.
     * If the entry is a string, the string value MUST be one of the id values in one of the objects in the
     * credentials_supported Credential Issuer metadata parameter.
     * When processing, the Wallet MUST resolve this string value to the respective object.
     */
    credentials: (CredentialOfferFormatV1_0_11 | string)[];
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
export type CredentialRequestV1_0_11 = CommonCredentialRequest & (CredentialRequestJwtVcJson | CredentialRequestJwtVcJsonLdAndLdpVc | CredentialRequestSdJwtVc);
export interface CredentialIssuerMetadataV1_0_11 extends CredentialIssuerMetadataOpts, Partial<AuthorizationServerMetadata> {
    authorization_servers?: string[];
    credential_endpoint: string;
    credential_response_encryption_alg_values_supported?: string;
    credential_response_encryption_enc_values_supported?: string;
    require_credential_response_encryption?: boolean;
    credential_identifiers_supported?: boolean;
}
export interface AuthorizationRequestV1_0_11 extends AuthorizationDetailsJwtVcJson, AuthorizationDetailsJwtVcJson {
    issuer_state?: string;
}
export declare function isAuthorizationRequestV1_0_11(request: CommonAuthorizationRequest): boolean;
export interface EndpointMetadataResultV1_0_11 extends EndpointMetadata {
    authorizationServerType: AuthorizationServerType;
    authorizationServerMetadata?: AuthorizationServerMetadata;
    credentialIssuerMetadata?: Partial<AuthorizationServerMetadata> & IssuerMetadataV1_0_08;
}
//# sourceMappingURL=v1_0_11.types.d.ts.map