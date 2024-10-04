import { BaseJWK } from '@sphereon/oid4vc-common';
import { IVerifiableCredential } from '@sphereon/ssi-types';
import { ExperimentalSubjectIssuance } from '../experimental/holder-vci';
import { AuthzFlowType } from './Authorization.types';
import { OID4VCICredentialFormat, TxCode, UniformCredentialRequest } from './Generic.types';
import { OpenId4VCIVersion } from './OpenID4VCIVersions.types';
import { CredentialOfferPayloadV1_0_08, CredentialRequestV1_0_08 } from './v1_0_08.types';
import { CredentialOfferPayloadV1_0_09, CredentialOfferV1_0_09 } from './v1_0_09.types';
import { CredentialOfferPayloadV1_0_11, CredentialOfferV1_0_11, CredentialRequestV1_0_11 } from './v1_0_11.types';
import { CredentialOfferPayloadV1_0_13, CredentialOfferV1_0_13, CredentialRequestV1_0_13 } from './v1_0_13.types';
export interface CredentialResponse extends ExperimentalSubjectIssuance {
    credential?: IVerifiableCredential | string;
    format?: OID4VCICredentialFormat;
    transaction_id?: string;
    acceptance_token?: string;
    c_nonce?: string;
    c_nonce_expires_in?: number;
    notification_id?: string;
}
export interface CredentialOfferRequestWithBaseUrl extends UniformCredentialOfferRequest {
    scheme: string;
    clientId?: string;
    baseUrl: string;
    txCode?: TxCode;
    issuerState?: string;
    preAuthorizedCode?: string;
    userPinRequired: boolean;
}
export type CredentialOffer = CredentialOfferV1_0_09 | CredentialOfferV1_0_11 | CredentialOfferV1_0_13;
export type CredentialOfferPayloadLatest = CredentialOfferPayloadV1_0_13;
export type CredentialRequest = UniformCredentialRequest | CredentialRequestV1_0_13 | CredentialRequestV1_0_11 | CredentialRequestV1_0_08;
export type CredentialOfferPayload = (CredentialOfferPayloadV1_0_08 | CredentialOfferPayloadV1_0_09 | CredentialOfferPayloadV1_0_11 | CredentialOfferPayloadV1_0_13) & {
    [x: string]: any;
};
export interface AssertedUniformCredentialOffer extends UniformCredentialOffer {
    credential_offer: UniformCredentialOfferPayload;
}
export interface UniformCredentialOffer {
    credential_offer?: UniformCredentialOfferPayload;
    credential_offer_uri?: string;
}
export interface UniformCredentialOfferRequest extends AssertedUniformCredentialOffer {
    original_credential_offer: CredentialOfferPayload;
    version: OpenId4VCIVersion;
    supportedFlows: AuthzFlowType[];
}
export type UniformCredentialOfferPayload = CredentialOfferPayloadV1_0_11 | CredentialOfferPayloadV1_0_13;
export interface ProofOfPossession {
    proof_type: 'jwt';
    jwt: string;
    [x: string]: unknown;
}
export type SearchValue = {
    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
};
export declare enum JsonURIMode {
    JSON_STRINGIFY = 0,
    X_FORM_WWW_URLENCODED = 1
}
export type EncodeJsonAsURIOpts = {
    uriTypeProperties?: string[];
    arrayTypeProperties?: string[];
    baseUrl?: string;
    param?: string;
    mode?: JsonURIMode;
    version?: OpenId4VCIVersion;
};
export type DecodeURIAsJsonOpts = {
    requiredProperties?: string[];
    arrayTypeProperties?: string[];
};
export interface Jwt {
    header: JWTHeader;
    payload: JWTPayload;
}
export interface ProofOfPossessionCallbacks<DIDDoc = never> {
    signCallback: JWTSignerCallback;
    verifyCallback?: JWTVerifyCallback<DIDDoc>;
}
/**
 * Signature algorithms.
 *
 * TODO: Move towards string literal unions and string type, given we do not provide signature/key implementations in this library to begin with
 * @See: https://github.com/Sphereon-Opensource/OID4VCI/issues/88
 */
export declare enum Alg {
    EdDSA = "EdDSA",
    ES256 = "ES256",
    ES256K = "ES256K",
    PS256 = "PS256",
    PS384 = "PS384",
    PS512 = "PS512",
    RS256 = "RS256",
    RS384 = "RS384",
    RS512 = "RS512"
}
export type Typ = 'JWT' | 'openid4vci-proof+jwt';
export interface JoseHeaderParameters {
    kid?: string;
    x5t?: string;
    x5c?: string[];
    x5u?: string;
    jku?: string;
    jwk?: BaseJWK;
    typ?: string;
    cty?: string;
}
export interface JWSHeaderParameters extends JoseHeaderParameters {
    alg?: Alg | string;
    b64?: boolean;
    crit?: string[];
    [propName: string]: unknown;
}
export interface CompactJWSHeaderParameters extends JWSHeaderParameters {
    alg: string;
}
export interface JWTHeaderParameters extends CompactJWSHeaderParameters {
    b64?: true;
}
export type JWTHeader = JWTHeaderParameters;
export interface JWTPayload {
    iss?: string;
    aud?: string | string[];
    iat?: number;
    nonce?: string;
    jti?: string;
    exp?: number;
    client_id?: string;
    [s: string]: unknown;
}
export type JWTSignerCallback = (jwt: Jwt, kid?: string) => Promise<string>;
export type JWTVerifyCallback<DIDDoc = never> = (args: {
    jwt: string;
    kid?: string;
}) => Promise<JwtVerifyResult<DIDDoc>>;
export interface JwtVerifyResult<DIDDoc = never> {
    jwt: Jwt;
    kid?: string;
    alg: string;
    did?: string;
    didDocument?: DIDDoc;
    x5c?: string[];
    jwk?: BaseJWK;
}
//# sourceMappingURL=CredentialIssuance.types.d.ts.map